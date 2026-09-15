export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-950 dark:text-white font-mono antialiased transition-colors duration-200 pb-20">
      {/* Top Navbar Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b-3 border-slate-900 dark:border-white bg-white/90 dark:bg-[#0E121D]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-28 h-5 rounded-lg bg-slate-300 dark:bg-slate-700 border border-slate-900 dark:border-white" />
          </div>
          <div className="hidden md:flex items-center gap-3 animate-pulse">
            <div className="w-20 h-8 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900 dark:border-white" />
            <div className="w-20 h-8 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900 dark:border-white" />
            <div className="w-20 h-8 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900 dark:border-white" />
          </div>
          <div className="flex items-center gap-2 animate-pulse">
            <div className="w-10 h-8 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900 dark:border-white" />
            <div className="w-10 h-8 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900 dark:border-white" />
            <div className="w-20 h-8 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900 dark:border-white" />
          </div>
        </div>
      </div>

      {/* Main Container Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 space-y-10 relative z-10">
        {/* Hero Banner Skeleton */}
        <div className="p-8 sm:p-12 rounded-3xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-6 animate-pulse">
          <div className="w-40 h-6 rounded-lg bg-amber-300 dark:bg-amber-600 border-2 border-slate-900" />
          <div className="space-y-3">
            <div className="w-3/4 h-12 rounded-2xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900" />
            <div className="w-1/2 h-12 rounded-2xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900" />
          </div>
          <div className="w-5/6 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-4 pt-4">
            <div className="w-40 h-10 rounded-xl bg-[#DC2626] border-2 border-slate-900" />
            <div className="w-32 h-10 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900" />
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

