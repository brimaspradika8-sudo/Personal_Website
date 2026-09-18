"use client";

import React from "react";
import Image from "next/image";
import { Reorder, useDragControls } from "framer-motion";
import { UploadCloud, X, GripVertical, Images } from "lucide-react";
import { uploadProjectImage } from "@/lib/actions/project";
import { soundFx } from "@/lib/audio/sound";

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
      className="relative w-full h-28 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white overflow-hidden flex flex-col items-center justify-center group"
    >
      <Image
        src={imgUrl}
        alt={`Gambar ${index + 1}`}
        fill
        unoptimized
        className="object-cover pointer-events-none"
      />

      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 text-[#FFFF00] text-[9px] font-mono font-black border border-black z-10 pointer-events-none">
        #{index + 1}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 p-1 bg-red-600 text-white border border-black cursor-pointer hover:bg-red-800 transition-transform hover:scale-110 z-20"
        title="Hapus gambar ini"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="absolute bottom-1 right-1 p-1 bg-black/80 text-white border border-black cursor-grab active:cursor-grabbing touch-none z-20"
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
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 5) {
      setStatusMsg({ type: "error", text: "Maksimal 5 gambar per proyek." });
      return;
    }

    setUploadingImage(true);
    setStatusMsg(null);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (images.length + uploadedUrls.length >= 5) break;
      const formData = new FormData();
      formData.append("file", files[i]);

      const res = await uploadProjectImage(formData);
      if ("url" in res && res.url) {
        uploadedUrls.push(res.url);
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls].slice(0, 5));
      setStatusMsg({
        type: "success",
        text: `${uploadedUrls.length} gambar berhasil diunggah!`,
      });
    } else {
      setStatusMsg({ type: "error", text: "Gagal mengunggah gambar." });
    }

    setUploadingImage(false);
    e.target.value = "";
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (images.length >= 5) {
      setStatusMsg({ type: "error", text: "Maksimal 5 gambar per proyek." });
      return;
    }
    onChange([...images, urlInput.trim()].slice(0, 5));
    setUrlInput("");
    setStatusMsg({ type: "success", text: "URL Gambar ditambahkan!" });
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
          01. GAMBAR PROYEK ({images.length}/5 GAMBAR CAROUSEL)
        </span>
        <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
          MAKSIMAL 5 GAMBAR
        </span>
      </div>

      {/* Grid Slot (Draggable + Static Empty Slots) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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

        {Array.from({ length: emptySlotsCount }).map((_, i) => {
          const slotNum = images.length + i + 1;
          return (
            <div
              key={`empty-${slotNum}`}
              className="relative w-full h-28 bg-slate-100 dark:bg-slate-900 border-2 border-black dark:border-white overflow-hidden flex flex-col items-center justify-center"
            >
              <div className="text-center p-2 space-y-1">
                <UploadCloud className="w-5 h-5 text-neutral-400 mx-auto" />
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
          <GripVertical className="w-3 h-3" />
          Tahan &amp; geser gambar untuk mengatur ulang urutan carousel.
        </p>
      )}

      {/* Inputs Uploader & URL Adder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* File Upload Box */}
        <label className="border-3 border-dashed border-black dark:border-white bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[100px]">
          <UploadCloud className="w-6 h-6 text-[#166534] dark:text-[#EAB308] mb-1" />
          <span className="text-xs font-mono font-black text-black dark:text-white uppercase">
            {uploadingImage ? "MENGUNGGAH GAMBAR..." : "UNGGAH FOTO PROYEK"}
          </span>
          <span className="text-[10px] font-mono text-neutral-500">
            Bisa pilih hingga {5 - images.length} gambar lagi
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploadingImage || images.length >= 5}
            className="hidden"
          />
        </label>

        {/* Paste URL Box */}
        <div className="space-y-2 flex flex-col justify-center">
          <label className="block text-[11px] font-mono font-black uppercase text-neutral-600 dark:text-neutral-400">
            ATAU TAMBAH VIA URL GAMBAR
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://domain.com/gambar.png"
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
