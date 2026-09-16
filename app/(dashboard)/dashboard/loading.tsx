export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono antialiased pb-24 selection:bg-[#FF0000] selection:text-white">
      {/* 1. TOP HEADER NAVIGATION SKELETON */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b-4 border-black dark:border-white px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-none bg-[#FF0000] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white font-black flex items-center justify-center text-sm">
              B
            </div>
            <div className="w-40 sm:w-56 h-6 rounded-none bg-black dark:bg-white" />
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-black uppercase">
            <div className="w-20 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            <div className="w-20 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            <div className="w-24 h-5 rounded-none bg-[#FFFF00]" />
            <div className="w-20 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-28 h-9 rounded-none bg-[#FFFF00] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION SKELETON */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-24 sm:pt-28 pb-12 overflow-hidden text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 w-full flex flex-col items-center justify-center text-center relative z-10 space-y-6 animate-pulse">
          
          {/* Greeting Pill Badge Skeleton */}
          <div className="w-52 h-8 rounded-none bg-[#FF0000] border-2 border-black dark:border-white text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]" />

          {/* Headline Typography Skeleton */}
          <div className="space-y-3 w-full flex flex-col items-center">
            <div className="w-72 sm:w-[480px] h-12 sm:h-16 rounded-none bg-[#FFFF00] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]" />
            <div className="w-4/5 max-w-xl h-10 sm:h-14 rounded-none bg-neutral-300 dark:bg-neutral-800 border-3 border-black dark:border-white" />
          </div>

          {/* Subtitle Paragraph Skeleton */}
          <div className="w-5/6 max-w-2xl space-y-2 pt-2">
            <div className="w-full h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            <div className="w-3/4 mx-auto h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
          </div>

          {/* CTA Buttons Skeleton */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="w-48 h-12 rounded-none bg-[#FF0000] border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
            <div className="w-44 h-12 rounded-none bg-[#FFFF00] border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
          </div>
        </div>
      </section>

      {/* 3. LATEST ARTICLES SECTION SKELETON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-pulse">
        <div className="space-y-2 text-left">
          <div className="w-64 h-8 rounded-none bg-[#FF0000] border-2 border-black dark:border-white text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-72 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured Hero Article Skeleton */}
          <div className="lg:col-span-7 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black p-6 space-y-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] min-h-[440px] flex flex-col justify-between">
            <div className="w-full h-56 sm:h-64 rounded-none bg-black border-2 border-black dark:border-white" />
            <div className="space-y-3">
              <div className="w-full h-7 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-4/5 h-7 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-full h-4 rounded-none bg-neutral-200 dark:bg-neutral-900" />
            </div>
            <div className="pt-4 border-t-3 border-black dark:border-white flex justify-between items-center">
              <div className="w-28 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-20 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            </div>
          </div>

          {/* Secondary Stacked Articles Skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black p-5 space-y-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-none bg-black border-2 border-black dark:border-white shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="w-full h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                    <div className="w-3/4 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                    <div className="w-1/2 h-3.5 rounded-none bg-neutral-200 dark:bg-neutral-900" />
                  </div>
                </div>
                <div className="pt-2 border-t-3 border-black dark:border-white flex justify-between items-center text-xs">
                  <div className="w-24 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                  <div className="w-16 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS SHOWCASE SKELETON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-pulse">
        <div className="space-y-2 text-left">
          <div className="w-60 h-8 rounded-none bg-[#FFFF00] border-2 border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-80 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="rounded-none border-4 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              <div className="w-full h-44 rounded-none bg-black border-2 border-black dark:border-white" />
              <div className="space-y-2">
                <div className="w-3/4 h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-full h-4 rounded-none bg-neutral-200 dark:bg-neutral-900" />
              </div>
              <div className="flex gap-2 pt-2">
                <div className="w-16 h-6 rounded-none bg-[#FFFF00]" />
                <div className="w-20 h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
