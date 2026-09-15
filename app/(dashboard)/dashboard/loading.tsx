export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-950 dark:text-white font-mono antialiased transition-colors duration-200 pb-20">
      {/* Top Sticky Header Skeleton */}
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

      {/* Hero Section Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 space-y-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-pulse">
          <div className="md:col-span-7 space-y-6">
            <div className="w-40 h-7 rounded-lg bg-amber-300 dark:bg-amber-600 border-2 border-slate-900" />
            <div className="space-y-3">
              <div className="w-full h-14 rounded-2xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900" />
              <div className="w-3/4 h-14 rounded-2xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900" />
            </div>
            <div className="w-5/6 h-5 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="flex gap-4 pt-4">
              <div className="w-40 h-10 rounded-xl bg-[#DC2626] border-2 border-slate-900" />
              <div className="w-32 h-10 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900" />
            </div>
          </div>
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="w-72 h-80 sm:h-96 rounded-3xl bg-slate-300 dark:bg-slate-700 border-3 border-slate-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>

        {/* Latest Articles Magazine Grid Skeleton */}
        <div className="space-y-6 pt-8 border-t-3 border-slate-900 dark:border-white animate-pulse">
          <div className="space-y-2">
            <div className="w-56 h-8 rounded-lg bg-slate-300 dark:bg-slate-700 border-2 border-slate-900" />
            <div className="w-72 h-4 rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-96 rounded-3xl bg-slate-300 dark:bg-slate-700 border-3 border-slate-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" />
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex-1 h-44 rounded-3xl bg-slate-300 dark:bg-slate-700 border-3 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              <div className="flex-1 h-44 rounded-3xl bg-slate-300 dark:bg-slate-700 border-3 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

