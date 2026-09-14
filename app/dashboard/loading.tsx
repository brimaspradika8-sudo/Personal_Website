export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F17] flex flex-col font-sans">
      {/* Header Skeleton */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0B0F17]/80 px-6 flex items-center justify-between">
        <div className="w-48 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="w-24 h-8 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-64 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="w-32 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>

        {/* Table Skeleton */}
        <div className="bg-white dark:bg-[#0E1015] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
