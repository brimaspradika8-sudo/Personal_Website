"use client";

import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isNight?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Hapus",
  cancelText = "Batal",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
  isNight = true,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape" && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-in fade-in duration-200">
      {/* Overlay Backdrop Click */}
      <div className="absolute inset-0" onClick={() => !isLoading && onCancel()} />

      {/* Modal Dialog Card */}
      <div
        className={`relative z-10 w-full max-w-md rounded-3xl p-6 sm:p-7 border shadow-2xl transition-all animate-in zoom-in-95 duration-200 ${
          isNight
            ? "bg-[#121620] border-slate-800 text-slate-100 shadow-slate-950/50"
            : "bg-white border-slate-200 text-slate-900 shadow-slate-400/20"
        }`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all disabled:opacity-50 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Icon Header */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              variant === "danger"
                ? "bg-red-500/10 border-red-500/20 text-[#D32F2F] dark:text-red-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-500"
            }`}
          >
            {variant === "danger" ? (
              <Trash2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
              Konfirmasi Tindakan
            </span>
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h3>
          </div>
        </div>

        {/* Description Text */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans mb-6">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 font-sans">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
              variant === "danger"
                ? "bg-[#D32F2F] hover:bg-[#B91C1C] shadow-red-500/20"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
