export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#F2F3F4] dark:bg-[#0B0F17] text-slate-950 dark:text-white font-mono antialiased transition-colors duration-200 pb-20">
      {/* 1. Capsule Floating Pill Header Skeleton */}
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl rounded-full border-2 sm:border-3 border-slate-900 dark:border-white bg-white/90 dark:bg-[#0E121D]/90 backdrop-blur-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] px-3.5 sm:px-6 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 animate-pulse">
          {/* Left Brand Capsule */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EAB308] border-2 border-slate-900 dark:border-white" />
            <div className="w-24 sm:w-32 h-4 sm:h-5 rounded-lg bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* Middle Nav Pill Links */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100/80 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-900/20 dark:border-white/20">
            <div className="w-14 h-4 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="w-14 h-4 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="w-14 h-4 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="w-14 h-4 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-7 rounded-full bg-[#16A34A] border-2 border-slate-900" />
            <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-slate-900 dark:border-white" />
            <div className="w-20 sm:w-24 h-8 rounded-full bg-[#EAB308] border-2 border-slate-900 dark:border-white" />
          </div>
        </div>
      </header>

      {/* Main Container Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 space-y-10 relative z-10">
        {/* Hero Card Skeleton */}
        <div className="p-8 sm:p-12 rounded-3xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-6 animate-pulse">
          <div className="w-40 h-6 rounded-lg bg-[#16A34A] border-2 border-slate-900 text-white" />
          <div className="space-y-3">
            <div className="w-3/4 h-12 rounded-2xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900" />
            <div className="w-1/2 h-12 rounded-2xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900" />
          </div>
          <div className="w-5/6 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-4 pt-4">
            <div className="w-40 h-10 rounded-xl bg-[#EAB308] border-2 border-slate-900" />
            <div className="w-32 h-10 rounded-xl bg-[#16A34A] border-2 border-slate-900" />
          </div>
        </div>

        {/* Content Section Title Skeleton */}
        <div className="space-y-2 animate-pulse">
          <div className="w-48 h-8 rounded-lg bg-slate-300 dark:bg-slate-700 border-2 border-slate-900" />
          <div className="w-72 h-4 rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] p-5 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] animate-pulse"
            >
              <div className="w-full h-44 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900" />
              <div className="space-y-2">
                <div className="w-full h-6 rounded bg-slate-300 dark:bg-slate-700" />
                <div className="w-3/4 h-6 rounded bg-slate-300 dark:bg-slate-700" />
              </div>
              <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="pt-3 border-t-2 border-slate-900 dark:border-white flex justify-between items-center">
                <div className="w-24 h-4 rounded bg-slate-300 dark:bg-slate-700" />
                <div className="w-16 h-4 rounded bg-slate-300 dark:bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

