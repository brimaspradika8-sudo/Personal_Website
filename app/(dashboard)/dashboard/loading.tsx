export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0D14] text-slate-900 dark:text-white font-sans antialiased pb-28 sm:pb-20 selection:bg-[#EAB308] selection:text-slate-950">
      
      {/* 1. CAPSULE FLOATING TOP NAVBAR SKELETON */}
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl rounded-full border-2 sm:border-3 border-slate-900 dark:border-white bg-white/90 dark:bg-[#0E121D]/90 backdrop-blur-md font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] px-3.5 sm:px-6 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 animate-pulse">
          
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EAB308] border-2 border-slate-900 text-slate-950 flex items-center justify-center font-mono font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              B
            </div>
            <div className="w-28 sm:w-36 h-4 sm:h-5 rounded-md bg-slate-900 dark:bg-white" />
          </div>

          {/* Middle: Desktop Nav Links Pill Skeleton */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100/80 dark:bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-900/20 dark:border-white/20">
            <div className="w-14 h-4 rounded-full bg-slate-300 dark:bg-slate-800" />
            <div className="w-16 h-4 rounded-full bg-slate-300 dark:bg-slate-800" />
            <div className="w-18 h-4 rounded-full bg-[#EAB308]" />
            <div className="w-16 h-4 rounded-full bg-slate-300 dark:bg-slate-800" />
          </div>

          {/* Right: Lang Toggle & User Badge Skeleton */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-7 rounded-full bg-[#EAB308] border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-24 sm:w-32 h-7 sm:h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION SKELETON */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center pt-28 sm:pt-36 pb-12 text-center overflow-hidden">
        
        {/* Running Ticker Banner Skeleton */}
        <div className="w-full bg-[#EAB308] border-y-2 sm:border-y-3 border-slate-900 py-2 sm:py-2.5 mb-10 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="max-w-4xl mx-auto h-4 rounded-md bg-slate-950/20 animate-pulse" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 w-full flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
          
          {/* Greeting Pill Badge (CIAO) Skeleton */}
          <div className="w-28 sm:w-36 h-9 sm:h-11 rounded-2xl bg-[#EAB308] border-3 sm:border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />

          {/* Headline Typography Skeleton */}
          <div className="space-y-3 w-full flex flex-col items-center">
            <div className="w-72 sm:w-[520px] h-10 sm:h-16 rounded-xl bg-slate-950 dark:bg-white" />
            <div className="w-48 sm:w-64 h-9 sm:h-14 rounded-xl bg-[#166534]" />
          </div>

          {/* Subtitle Paragraph Skeleton */}
          <div className="w-5/6 max-w-2xl space-y-2 pt-2">
            <div className="w-full h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
            <div className="w-3/4 mx-auto h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
          </div>

          {/* CTA Buttons Skeleton */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <div className="w-44 sm:w-48 h-12 sm:h-13 rounded-2xl bg-[#EAB308] border-3 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-36 sm:w-40 h-12 sm:h-13 rounded-2xl bg-[#166534] border-3 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          </div>

        </div>
      </section>

      {/* 3. LATEST ARTICLES SECTION SKELETON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-pulse">
        <div className="space-y-2 text-left">
          <div className="w-52 h-8 rounded-xl bg-[#EAB308] border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-72 h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured Hero Article Skeleton */}
          <div className="lg:col-span-7 rounded-3xl border-3 sm:border-4 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] p-5 sm:p-6 space-y-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between">
            <div className="w-full h-52 sm:h-64 rounded-2xl bg-slate-900 dark:bg-slate-800 border-2 border-slate-900 relative">
              <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-[#EAB308] border border-slate-900" />
              <div className="absolute bottom-3 right-3 w-20 h-6 rounded-lg bg-[#EAB308] border border-slate-900" />
            </div>
            <div className="space-y-3">
              <div className="w-full h-7 rounded-md bg-slate-950 dark:bg-white" />
              <div className="w-4/5 h-7 rounded-md bg-slate-950 dark:bg-white" />
              <div className="w-full h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
            </div>
            <div className="pt-4 border-t-2 border-slate-900 dark:border-white flex justify-between items-center">
              <div className="w-28 h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
              <div className="w-20 h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
            </div>
          </div>

          {/* Secondary Stacked Articles Skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 rounded-2xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] p-5 space-y-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-900 dark:bg-slate-800 border-2 border-slate-900 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="w-full h-5 rounded-md bg-slate-950 dark:bg-white" />
                    <div className="w-3/4 h-5 rounded-md bg-slate-950 dark:bg-white" />
                    <div className="w-1/2 h-3.5 rounded-md bg-slate-300 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="pt-2 border-t-2 border-slate-900 dark:border-white flex justify-between items-center text-xs">
                  <div className="w-24 h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
                  <div className="w-16 h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS SHOWCASE SKELETON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-pulse">
        <div className="space-y-2 text-left">
          <div className="w-52 h-8 rounded-xl bg-[#166534] border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-80 h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] p-5 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              <div className="w-full h-44 rounded-xl bg-slate-900 dark:bg-slate-800 border-2 border-slate-900" />
              <div className="space-y-2">
                <div className="w-3/4 h-6 rounded-md bg-slate-950 dark:bg-white" />
                <div className="w-full h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
              </div>
              <div className="flex gap-2 pt-2">
                <div className="w-16 h-6 rounded-lg bg-[#EAB308]" />
                <div className="w-20 h-6 rounded-lg bg-slate-300 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
