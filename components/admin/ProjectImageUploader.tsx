"use client";

import React from "react";
import Image from "next/image";
import { Reorder, useDragControls } from "framer-motion";
import { UploadCloud, X, GripVertical, Images, Video } from "lucide-react";
import { uploadProjectImage } from "@/lib/actions/project";
import { soundFx } from "@/lib/audio/sound";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ensurePublicSupabaseUrl } from "@/lib/supabase/url";

export const isVideoUrl = (url: string) => {
  if (!url) return false;
  const cleanUrl = url.split("?")[0].toLowerCase();
  return (
    cleanUrl.endsWith(".mp4") ||
    cleanUrl.endsWith(".webm") ||
    cleanUrl.endsWith(".mov") ||
    cleanUrl.endsWith(".ogg") ||
    url.startsWith("data:video/")
  );
};

interface ProjectImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  uploadingImage: boolean;
  setUploadingImage: (v: boolean) => void;
  urlInput: string;
  setUrlInput: (v: string) => void;
  setStatusMsg: (msg: { type: "success" | "error"; text: string } | null) => void;
}

function ImageSlotItem({
  imgUrl,
  index,
  onRemove,
}: {
  imgUrl: string;
  index: number;
  onRemove: () => void;
}) {
  const dragControls = useDragControls();
  const safeUrl = ensurePublicSupabaseUrl(imgUrl);
  const isVid = isVideoUrl(safeUrl);

  return (
    <Reorder.Item
      value={imgUrl}
      as="div"
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{
        scale: 1.06,
        zIndex: 50,
        boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
        cursor: "grabbing",
      }}
      className="relative w-full h-28 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white overflow-hidden flex flex-col items-center justify-center group select-none"
    >
      {isVid ? (
        <video
          src={safeUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover pointer-events-none"
        />
      ) : (
        <Image
          src={safeUrl}
          alt={`Media ${index + 1}`}
          fill
          unoptimized
          className="object-cover pointer-events-none"
        />
      )}

      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 text-[#FFFF00] text-[9px] font-mono font-black border border-black z-10 pointer-events-none flex items-center gap-1">
        {isVid ? <Video className="w-2.5 h-2.5 text-[#00FF66]" /> : null}
        <span>#{index + 1}</span>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 p-1 bg-red-600 text-white border border-black cursor-pointer hover:bg-red-800 transition-transform hover:scale-110 z-20"
        title="Hapus media ini"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div
        onPointerDown={(e) => {
          e.preventDefault();
          dragControls.start(e);
        }}
        className="absolute bottom-1 right-1 p-1 bg-black/80 text-white border border-black cursor-grab active:cursor-grabbing touch-none z-20 hover:bg-amber-500 hover:text-black transition-colors"
        title="Tahan untuk geser urutan"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>
    </Reorder.Item>
  );
}

export default function ProjectImageUploader({
  images,
  onChange,
  uploadingImage,
  setUploadingImage,
  urlInput,
  setUrlInput,
  setStatusMsg,
}: ProjectImageUploaderProps) {
  // Safe Media Upload with multi-level fallback & JSON validation
  const uploadMediaDirectly = async (file: File): Promise<{ url?: string; error?: string }> => {
    try {
      const isVid = file.type.startsWith("video/");
      const maxLimit = isVid ? 50 * 1024 * 1024 : 10 * 1024 * 1024;

      if (file.size > maxLimit) {
        return {
          error: `Ukuran file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)}MB) melebihi batas ${
            isVid ? "video (50MB)" : "gambar/GIF (10MB)"
          }.`,
        };
      }

      // Method A: Direct Browser Supabase Client Upload (Bypasses Vercel/Next.js limits)
      try {
        const supabase = createBrowserSupabaseClient();
        const fileExt = file.name.split(".").pop() || (isVid ? "mp4" : "png");
        const sanitizedExt = fileExt.replace(/[^a-zA-Z0-9]/g, "");
        const fileName = `project-media/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${sanitizedExt}`;
        const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "articles";

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            contentType: file.type || "application/octet-stream",
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
          if (publicUrlData?.publicUrl) {
            return { url: ensurePublicSupabaseUrl(publicUrlData.publicUrl) };
          }
        }
      } catch (clientErr) {
        console.warn("Direct browser upload warning:", clientErr);
      }

      // Method B: REST API Endpoint /api/upload
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "project-media");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.status === 413) {
          return { error: `File "${file.name}" terlalu besar untuk diunggah (Status 413). Batas max 50MB.` };
        }

        const contentType = res.headers.get("content-type") || "";
        if (res.ok && contentType.includes("application/json")) {
          const json = await res.json();
          if (json.url) {
            return { url: ensurePublicSupabaseUrl(json.url) };
          }
          if (json.error) {
            return { error: json.error };
          }
        }
      } catch (apiErr) {
        console.warn("API route upload warning:", apiErr);
      }

      // Method C: Server Action Fallback wrapped in try/catch
      try {
        const formData = new FormData();
        formData.append("file", file);
        const actionRes = await uploadProjectImage(formData);
        if ("url" in actionRes && actionRes.url) {
          return { url: ensurePublicSupabaseUrl(actionRes.url) };
        }
        if ("error" in actionRes && actionRes.error) {
          return { error: actionRes.error };
        }
      } catch (actionErr) {
        console.warn("Server action upload catch:", actionErr);
      }

      return { error: `Gagal mengunggah file "${file.name}". Pastikan ukuran file < 10MB (Foto/GIF) atau < 50MB (Video).` };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga saat upload.";
      return { error: msg };
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 5) {
      setStatusMsg({ type: "error", text: "Maksimal 5 media (gambar/video) per proyek." });
      return;
    }

    setUploadingImage(true);
    setStatusMsg(null);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (images.length + uploadedUrls.length >= 5) break;

      try {
        const res = await uploadMediaDirectly(files[i]);
        if (res.url) {
          uploadedUrls.push(res.url);
        } else if (res.error) {
          setStatusMsg({ type: "error", text: res.error });
          setUploadingImage(false);
          e.target.value = "";
          return;
        }
      } catch (fileErr) {
        console.error("Single file upload error:", fileErr);
        setStatusMsg({
          type: "error",
          text: `Gagal mengunggah berkas ${files[i].name}.`,
        });
        setUploadingImage(false);
        e.target.value = "";
        return;
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls].slice(0, 5));
      setStatusMsg({
        type: "success",
        text: `${uploadedUrls.length} file media berhasil diunggah!`,
      });
    }

    setUploadingImage(false);
    e.target.value = "";
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (images.length >= 5) {
      setStatusMsg({ type: "error", text: "Maksimal 5 media per proyek." });
      return;
    }
    const safeInput = ensurePublicSupabaseUrl(urlInput.trim());
    onChange([...images, safeInput].slice(0, 5));
    setUrlInput("");
    setStatusMsg({ type: "success", text: "URL Media berhasil ditambahkan!" });
  };

  const handleRemoveImage = (imgUrl: string) => {
    soundFx.playClick();
    onChange(images.filter((url) => url !== imgUrl));
  };

  const emptySlotsCount = Math.max(0, 5 - images.length);

  return (
    <div className="p-6 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
      <div className="flex items-center justify-between border-b-3 border-black dark:border-white pb-3">
        <span className="text-xs font-mono font-black uppercase text-black dark:text-white flex items-center gap-2">
          <Images className="w-4 h-4 text-[#166534] dark:text-[#EAB308]" />
          01. MEDIA PROYEK ({images.length}/5 GAMBAR / VIDEO CAROUSEL)
        </span>
        <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
          MAKSIMAL 5 MEDIA
        </span>
      </div>

      {/* Main Outer Grid Container */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Reorder Group wraps ONLY filled media items */}
        {images.length > 0 && (
          <Reorder.Group
            as="div"
            axis="x"
            values={images}
            onReorder={onChange}
            className="contents"
          >
            {images.map((imgUrl, index) => (
              <ImageSlotItem
                key={imgUrl}
                imgUrl={imgUrl}
                index={index}
                onRemove={() => handleRemoveImage(imgUrl)}
              />
            ))}
          </Reorder.Group>
        )}

        {/* Static Non-Draggable Empty Slots */}
        {Array.from({ length: emptySlotsCount }).map((_, i) => {
          const slotNum = images.length + i + 1;
          return (
            <div
              key={`empty-${slotNum}`}
              className="relative w-full h-28 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white overflow-hidden flex flex-col items-center justify-center select-none"
            >
              <div className="text-center p-2 space-y-1">
                <UploadCloud className="w-5 h-5 text-neutral-400 mx-auto opacity-60" />
                <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase block">
                  SLOT #{slotNum}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {images.length > 1 && (
        <p className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
          <GripVertical className="w-3 h-3 text-[#166534] dark:text-[#EAB308]" />
          Tahan ikon grip untuk menggeser urutan carousel (hanya slot terisi yang dapat digeser).
        </p>
      )}

      {/* Inputs Uploader & URL Adder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* File Upload Box */}
        <label className="border-3 border-dashed border-black dark:border-white bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[100px]">
          <UploadCloud className="w-6 h-6 text-[#166534] dark:text-[#EAB308] mb-1" />
          <span className="text-xs font-mono font-black text-black dark:text-white uppercase">
            {uploadingImage ? "MENGUNGGAH MEDIA..." : "UNGGAH FOTO / VIDEO PROYEK"}
          </span>
          <span className="text-[10px] font-mono text-neutral-500">
            Foto max 10MB / Video max 50MB (pilih hingga {5 - images.length} lagi)
          </span>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploadingImage || images.length >= 5}
            className="hidden"
          />
        </label>

        {/* Paste URL Box */}
        <div className="space-y-2 flex flex-col justify-center">
          <label className="block text-[11px] font-mono font-black uppercase text-neutral-600 dark:text-neutral-400">
            ATAU TAMBAH VIA URL (GAMBAR / VIDEO MP4)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://domain.com/video.mp4 atau /gambar.png"
              className="flex-1 px-3 py-2 border-2 border-black dark:border-white bg-white dark:bg-slate-900 text-black dark:text-white text-xs font-mono focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              disabled={images.length >= 5 || !urlInput.trim()}
              className="px-3 py-2 bg-[#166534] text-white border-2 border-black font-mono font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#14532D] disabled:opacity-50 cursor-pointer"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
