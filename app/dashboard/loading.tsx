export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 pb-20">
      {/* Floating Header Skeleton */}
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

      {/* Hero Section Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-pulse">
          <div className="md:col-span-7 space-y-6">
            <div className="w-28 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-3">
              <div className="w-full h-12 sm:h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="w-3/4 h-12 sm:h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="w-5/6 h-4 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="flex gap-4 pt-4">
              <div className="w-36 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="w-28 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="w-72 h-80 sm:h-96 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        {/* Latest Articles Magazine Grid Skeleton */}
        <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800/80 animate-pulse">
          <div className="space-y-2">
            <div className="w-48 h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="w-64 h-4 rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 h-96 rounded-3xl bg-slate-200 dark:bg-slate-800" />
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex-1 h-44 rounded-3xl bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 h-44 rounded-3xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
