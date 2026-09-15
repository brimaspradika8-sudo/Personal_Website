export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 pb-20">
      {/* Top Floating Navbar Skeleton */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className="h-14 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between shadow-xs animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="w-28 h-4 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <div className="w-16 h-3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-16 h-3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-16 h-3 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="w-20 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Main Container Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 space-y-12">
        {/* Hero Banner Skeleton */}
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] shadow-xs space-y-6 animate-pulse">
          <div className="w-32 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-3">
            <div className="w-3/4 h-10 sm:h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="w-1/2 h-10 sm:h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="w-5/6 h-4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-4 pt-4">
            <div className="w-36 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="w-28 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        {/* Content Section Title Skeleton */}
        <div className="space-y-2 animate-pulse">
          <div className="w-48 h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="w-72 h-4 rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1015] overflow-hidden space-y-4 p-4 shadow-xs animate-pulse"
            >
              <div className="w-full h-44 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2">
                <div className="w-full h-5 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="w-3/4 h-5 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="w-full h-3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="w-24 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="w-16 h-3 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
