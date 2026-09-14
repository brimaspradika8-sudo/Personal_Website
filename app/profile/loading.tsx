export default function ProfileLoading() {
  return (
    <div className="relative min-h-[100dvh] w-full font-sans antialiased bg-[#F8F9FA] dark:bg-[#0A0A0B] text-slate-900 dark:text-[#F1EFE9] pb-32 sm:pb-24">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0A0A0B]/80 h-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="w-36 h-4 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 animate-pulse" />
        </div>
      </header>

      {/* Main Container Skeleton */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 space-y-10 relative z-10">
        
        {/* Profile Header Block Skeleton */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pb-2 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left w-full sm:w-auto">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-200 dark:bg-white/10 shrink-0" />
            
            {/* Name & Info */}
            <div className="space-y-2 flex-1 w-full flex flex-col items-center sm:items-start">
              <div className="w-20 h-4 bg-slate-200 dark:bg-white/10 rounded" />
              <div className="w-48 h-8 bg-slate-200 dark:bg-white/10 rounded" />
              <div className="w-36 h-4 bg-slate-200 dark:bg-white/10 rounded" />
            </div>
          </div>

          {/* Action Button Skeleton */}
          <div className="w-28 h-9 bg-slate-200 dark:bg-white/10 rounded-xl shrink-0" />
        </div>

        {/* Divider */}
        <div className="border-b border-slate-200 dark:border-white/10" />

        {/* Tab Navigation Skeleton */}
        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto animate-pulse">
          <div className="w-20 h-4 bg-slate-200 dark:bg-white/10 rounded" />
          <div className="w-24 h-4 bg-slate-200 dark:bg-white/10 rounded" />
          <div className="w-24 h-4 bg-slate-200 dark:bg-white/10 rounded" />
          <div className="w-20 h-4 bg-slate-200 dark:bg-white/10 rounded" />
        </div>

        {/* Tab Content Box Skeleton */}
        <div className="border border-slate-200 dark:border-white/10 rounded-2xl p-8 sm:p-10 bg-white dark:bg-[#121214] shadow-sm animate-pulse space-y-6">
          <div className="space-y-2 border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="w-40 h-6 bg-slate-200 dark:bg-white/10 rounded" />
            <div className="w-56 h-4 bg-slate-200 dark:bg-white/10 rounded" />
          </div>

          <div className="divide-y divide-slate-200 dark:divide-white/10">
            <div className="py-4 flex justify-between items-center">
              <div className="w-24 h-4 bg-slate-200 dark:bg-white/10 rounded" />
              <div className="w-32 h-4 bg-slate-200 dark:bg-white/10 rounded" />
            </div>
            <div className="py-4 flex justify-between items-center">
              <div className="w-28 h-4 bg-slate-200 dark:bg-white/10 rounded" />
              <div className="w-24 h-4 bg-slate-200 dark:bg-white/10 rounded" />
            </div>
            <div className="py-4 flex justify-between items-center">
              <div className="w-32 h-4 bg-slate-200 dark:bg-white/10 rounded" />
              <div className="w-40 h-4 bg-slate-200 dark:bg-white/10 rounded" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
