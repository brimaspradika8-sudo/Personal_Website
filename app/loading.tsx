export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white font-mono antialiased selection:bg-[#FF0000] selection:text-white p-4">
      <div className="flex flex-col items-center space-y-6 text-center">
        {/* Signature Neo-Brutalist Animated Square Box */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-[#FF0000] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] animate-bounce" />
          <div className="absolute inset-2 bg-[#FFFF00] border-3 border-black flex items-center justify-center font-black text-xl text-black">
            B
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-mono font-black uppercase tracking-wider text-black dark:text-white bg-[#FFFF00] text-black px-4 py-1.5 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
            MEMUAT DATA PORTFOLIO...
          </h2>
          <p className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest animate-pulse">
            BRIMAS PRADIKA UTAMA · AI &amp; FULLSTACK
          </p>
        </div>
      </div>
    </div>
  );
}
