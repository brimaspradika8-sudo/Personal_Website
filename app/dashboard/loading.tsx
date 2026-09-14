export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F4F5F6] dark:bg-[#0B0F17] flex flex-col font-sans transition-colors duration-300">
      {/* Header Skeleton */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#111622]/90 px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="w-36 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="w-24 h-8 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Hero Content Skeleton */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Column Text Skeleton */}
        <div className="md:col-span-7 space-y-6">
          <div className="w-28 h-6 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="space-y-3">
            <div className="w-full h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="w-3/4 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
          <div className="w-5/6 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="flex gap-4 pt-4">
            <div className="w-40 h-12 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="w-32 h-12 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Right Column Photo Skeleton */}
        <div className="md:col-span-5 flex justify-end">
          <div className="w-full max-w-sm h-96 bg-slate-200/80 dark:bg-slate-800/80 rounded-3xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
