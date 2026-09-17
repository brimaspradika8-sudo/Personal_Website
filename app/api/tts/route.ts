import { NextResponse } from "next/server";
import { EdgeTTS } from "node-edge-tts";
import fs from "fs/promises";
import path from "path";
import os from "os";

// Server-side In-Memory Audio Cache (LRU style, max 50 items, TTL 24h)
interface CacheEntry {
  buffer: ArrayBuffer;
  timestamp: number;
}

const ttsCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_ITEMS = 50;

function generateCacheKey(engine: string, text: string, voiceId: string): string {
  let hash = 0;
  const str = `${engine}:${voiceId}:${text}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `tts_${hash}`;
}

function getFromCache(key: string): ArrayBuffer | null {
  const entry = ttsCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    ttsCache.delete(key);
    return null;
  }
  return entry.buffer;
}

function setToCache(key: string, buffer: ArrayBuffer) {
  if (ttsCache.size >= MAX_CACHE_ITEMS) {
    const oldestKey = ttsCache.keys().next().value;
    if (oldestKey) ttsCache.delete(oldestKey);
  }
  ttsCache.set(key, { buffer, timestamp: Date.now() });
}

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getEffectiveUserTier } from "@/lib/membership";

/**
 * High-Performance Text-To-Speech API Route (Microsoft Edge Neural TTS + ElevenLabs Fallback)
 * Endpoint: POST /api/tts
 */
export async function POST(request: Request) {
  const startTime = performance.now();

  try {
    const body = await request.json();
    const { text, voiceId, engine = "edge" } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Teks tidak valid untuk audio" }, { status: 400 });
    }

    // 1. Backend Security: Verifikasi User Membership Tier Server-side
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Silakan login dan upgrade membership untuk mendengarkan Narasi Suara AI." },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    const userTier = dbUser ? await getEffectiveUserTier(dbUser.id) : "FREE";

    if (userTier === "FREE") {
      return NextResponse.json(
        { error: "Fitur Narasi Suara AI khusus untuk Kawan Brimas & Sahabat Brimas VIP." },
        { status: 403 }
      );
    }

    // Clean markdown and trim text length
    const cleanText = text
      .replace(/```[\s\S]*?```/g, " Kode program diabaikan. ")
      .replace(/<[^>]*>?/gm, " ")
      .replace(/[#*`_~-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4500);

    const selectedEngine = engine === "elevenlabs" ? "elevenlabs" : "edge";
    const defaultVoice = selectedEngine === "edge" ? "id-ID-ArdiNeural" : "1k39YpzqXZn52BgyLyGO";
    let targetVoiceId = voiceId || defaultVoice;

    // Hanya Sahabat Brimas VIP yang berhak memakai Suara Wanita (GadisNeural)
    if (targetVoiceId.includes("Gadis") && userTier !== "SAHABAT_BRIMAS") {
      targetVoiceId = "id-ID-ArdiNeural";
    }

    const cacheKey = generateCacheKey(selectedEngine, cleanText, targetVoiceId);
    const cachedBuffer = getFromCache(cacheKey);

    if (cachedBuffer) {
      const duration = (performance.now() - startTime).toFixed(1);
      console.log(`[TTS API] Cache HIT (${selectedEngine})! Served in ${duration}ms`);
      return new Response(cachedBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          "X-TTS-Engine": selectedEngine,
          "X-TTS-Cache": "HIT",
          "X-Response-Time": `${duration}ms`,
        },
      });
    }

    console.log(`[TTS API] Cache MISS (${selectedEngine}). Synthesizing ${cleanText.length} chars...`);

    let audioArrayBuffer: ArrayBuffer;

    if (selectedEngine === "edge") {
      // --- MICROSOFT EDGE NEURAL TTS (FREE, NO QUOTA LIMIT, FAST) ---
      const tempFile = path.join(
        os.tmpdir(),
        `edge_tts_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.mp3`
      );

      try {
        const tts = new EdgeTTS({
          voice: targetVoiceId,
          lang: targetVoiceId.startsWith("id-") ? "id-ID" : "en-US",
          outputFormat: "audio-24khz-48kbitrate-mono-mp3",
        });

        await tts.ttsPromise(cleanText, tempFile);
        const fileBuffer = await fs.readFile(tempFile);
        audioArrayBuffer = fileBuffer.buffer.slice(
          fileBuffer.byteOffset,
          fileBuffer.byteOffset + fileBuffer.byteLength
        );
      } finally {
        await fs.unlink(tempFile).catch(() => {});
      }
    } else {
      // --- ELEVENLABS TTS ---
      const apiKey = process.env.ELEVENLABS_API_KEY?.trim().replace(/^["']|["']$/g, "");
      if (!apiKey) {
        return NextResponse.json(
          { error: "ELEVENLABS_API_KEY belum dikonfigurasi di .env" },
          { status: 400 }
        );
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": apiKey,
            },
            body: JSON.stringify({
              text: cleanText,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.0,
                use_speaker_boost: true,
              },
            }),
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          let userMsg = `ElevenLabs API Error (${response.status})`;
          if (response.status === 402) {
            userMsg = "Kuota gratis karakter ElevenLabs API pada akun Anda telah habis (402 Payment Limit).";
          }
          return NextResponse.json({ error: userMsg, details: errorText }, { status: response.status });
        }

        audioArrayBuffer = await response.arrayBuffer();
      } finally {
        clearTimeout(timeoutId);
      }
    }

    // Store generated audio in Server Memory Cache
    setToCache(cacheKey, audioArrayBuffer);

    const totalDuration = (performance.now() - startTime).toFixed(1);
    console.log(`[TTS API] ${selectedEngine} TTS completed & cached in ${totalDuration}ms.`);

    return new Response(audioArrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
        "X-TTS-Engine": selectedEngine,
        "X-TTS-Cache": "MISS",
        "X-Response-Time": `${totalDuration}ms`,
      },
    });
  } catch (error: any) {
    const totalDuration = (performance.now() - startTime).toFixed(1);
    console.error(`[TTS API] Error after ${totalDuration}ms:`, error);
    return NextResponse.json(
      { error: error?.message || "Gagal memproses AI Text-To-Speech" },
      { status: 500 }
    );
  }
}
