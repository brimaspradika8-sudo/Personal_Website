import { NextResponse } from "next/server";

/**
 * ElevenLabs Text-To-Speech API Route
 * Endpoint: POST /api/tts
 */
export async function POST(request: Request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY?.trim().replace(/^["']|["']$/g, "");
    
    // Check if API key is configured
    if (!apiKey) {
      return NextResponse.json(
        { error: "ELEVENLABS_API_KEY belum dikonfigurasi di file .env" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { text, voiceId } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Teks tidak valid untuk audio" }, { status: 400 });
    }

    // Voice ID dari ElevenLabs (Default dari request user: 1k39YpzqXZn52BgyLyGO)
    const targetVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID || "1k39YpzqXZn52BgyLyGO";

    // Clean markdown and trim text length to safe API limits
    const cleanText = text
      .replace(/```[\s\S]*?```/g, " Kode program diabaikan. ")
      .replace(/<[^>]*>?/gm, " ")
      .replace(/[#*`_~-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 4500);

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
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error response:", errorText);
      return NextResponse.json(
        { error: `ElevenLabs API Error (${response.status}): ${response.statusText}` },
        { status: response.status }
      );
    }

    const audioArrayBuffer = await response.arrayBuffer();

    return new Response(audioArrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Error generating ElevenLabs TTS:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal memproses ElevenLabs TTS" },
      { status: 500 }
    );
  }
}
