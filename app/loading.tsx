export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F4F5F6] dark:bg-[#0B0F17] transition-colors duration-200">
      <div className="relative flex flex-col items-center gap-4">
        {/* Animated Crimson Spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-[#DC2626] animate-spin" />
        <span className="text-xs font-mono font-bold tracking-widest text-[#DC2626] uppercase animate-pulse">
          Memuat Halaman...
        </span>
      </div>
    </div>
  );
}
