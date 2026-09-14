export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="relative flex flex-col items-center gap-4">
        {/* Animated Crimson Ring */}
        <div className="w-12 h-12 rounded-full border-3 border-slate-200 dark:border-slate-800 border-t-[#D32F2F] animate-spin" />
        <span className="text-xs font-mono font-bold tracking-widest text-[#D32F2F] uppercase animate-pulse">
          Memuat Halaman...
        </span>
      </div>
    </div>
  );
}
