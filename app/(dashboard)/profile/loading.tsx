export default function ProfileLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Memuat profil..."
      className="relative min-h-[100dvh] w-full font-mono antialiased pb-32 sm:pb-24 bg-[#F4F4F0] dark:bg-black text-black dark:text-white"
    >
      <span className="sr-only">Memuat profil...</span>

      {/* Main Responsive Wrapper — Max Width 5xl Matching profile-client.tsx */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 space-y-6 sm:space-y-8 animate-pulse motion-reduce:animate-none">
        
        {/* 1. TOP HEADER BANNER CARD SKELETON */}
        <div className="rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
          {/* Cover Header Banner */}
          <div className="h-48 sm:h-64 w-full relative flex items-start justify-between p-4 border-b-4 border-black bg-neutral-800 dark:bg-neutral-900">
            <div className="px-3 py-1.5 rounded-none bg-white text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
              <span>BERANDA</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-none bg-[#FFFF00] text-black border-3 border-black text-xs font-mono font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
              <span>EDIT BANNER</span>
            </div>
          </div>

          {/* Overlapping Avatar Profile Picture — EXACT CENTER ALIGNMENT */}
          <div className="relative -mt-16 sm:-mt-20 flex flex-col items-center text-center px-4 pb-6 sm:pb-8">
            <div className="relative z-20">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-neutral-300 dark:bg-neutral-800" />
            </div>

            {/* Profile Name, Tagline & Badges Skeleton */}
            <div className="mt-4 space-y-3 w-full max-w-lg flex flex-col items-center">
              <div className="w-48 sm:w-64 h-7 sm:h-8 rounded-none bg-neutral-900 dark:bg-neutral-100" />
              <div className="w-64 sm:w-80 h-4 rounded-none bg-neutral-300 dark:bg-neutral-700" />

              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <div className="w-36 h-6 rounded-none border-2 border-black bg-[#FFFF00] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
                <div className="w-44 h-6 rounded-none border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
              </div>
            </div>
          </div>
        </div>

        {/* 1.5. PROMINENT MEMBERSHIP TIER CARD SKELETON */}
        <div className="rounded-none border-4 border-black bg-[#FFFF00] text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
          <div className="space-y-2 max-w-xl w-full">
            <div className="w-36 h-5 rounded-none bg-black" />
            <div className="w-64 h-7 rounded-none bg-black/80" />
            <div className="w-full max-w-md h-4 rounded-none bg-black/30" />
          </div>
          <div className="w-full sm:w-auto px-6 py-3.5 rounded-none bg-[#166534] border-3 border-black text-xs font-mono font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 h-11" />
        </div>

        {/* 2. DESKTOP 2-COLUMN GRID (Account Settings & Preferences Side-by-Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN: INFORMASI AKUN & KEAMANAN (4 Items) */}
          <div className="rounded-none border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] divide-y-3 divide-black flex flex-col justify-between">
            <div>
              <div className="p-4 bg-[#FFFF00] border-b-3 border-black text-black font-mono font-black text-xs uppercase">
                PENGATURAN AKUN &amp; KEAMANAN
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 flex-1">
                    <div className="w-10 h-10 rounded-none bg-neutral-200 dark:bg-neutral-800 border-2 border-black shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="w-36 h-4 bg-neutral-900 dark:bg-neutral-100 rounded-none" />
                      <div className="w-48 h-3 bg-neutral-300 dark:bg-neutral-700 rounded-none" />
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-neutral-300 dark:bg-neutral-700 rounded-none" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: PREFERENSI & SISTEM (4 Items) */}
          <div className="rounded-none border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] divide-y-3 divide-black flex flex-col justify-between">
            <div>
              <div className="p-4 bg-[#00FF66] border-b-3 border-black text-black font-mono font-black text-xs uppercase">
                PREFERENSI &amp; SISTEM
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 flex-1">
                    <div className="w-10 h-10 rounded-none bg-neutral-200 dark:bg-neutral-800 border-2 border-black shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="w-36 h-4 bg-neutral-900 dark:bg-neutral-100 rounded-none" />
                      <div className="w-32 h-3 bg-neutral-300 dark:bg-neutral-700 rounded-none" />
                    </div>
                  </div>
                  <div className="w-12 h-7 bg-neutral-300 dark:bg-neutral-700 border-2 border-black rounded-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. SAVED ARTICLES SECTION SKELETON */}
        <div className="rounded-none border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 space-y-4">
          <div className="w-48 h-6 bg-[#166534] border-2 border-black" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-none border-3 border-black bg-neutral-100 space-y-2">
                <div className="w-full h-5 bg-neutral-300 rounded-none" />
                <div className="w-24 h-3 bg-neutral-300 rounded-none" />
              </div>
            ))}
          </div>
        </div>

        {/* 4. SIGN OUT BUTTON SKELETON */}
        <div className="w-full py-4 rounded-none bg-[#166534] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-14" />
      </div>
    </div>
  );
}
