export default function PostsLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans pb-28 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* 1. TOP NAV BREADCRUMB SKELETON */}
        <div className="flex items-center justify-between">
          <div className="w-36 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="w-24 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>

        {/* 2. HERO TITLE SECTION SKELETON */}
        <div className="space-y-3 text-left animate-pulse">
          <div className="w-64 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="w-full max-w-lg h-4 rounded bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* 3. SEARCH & FILTER BAR SKELETON */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] shadow-xs space-y-4 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full flex-1 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="w-full sm:w-40 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-20 h-7 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            ))}
          </div>
        </div>

        {/* 4. ARTICLES GRID CARDS SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] overflow-hidden p-4 space-y-4 shadow-xs animate-pulse"
            >
              {/* Thumbnail Skeleton */}
              <div className="w-full h-44 rounded-xl bg-slate-200 dark:bg-slate-800 relative" />

              {/* Title & Content Excerpt Skeleton */}
              <div className="space-y-2 flex-1">
                <div className="w-full h-5 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="w-3/4 h-5 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="pt-2 space-y-1.5">
                  <div className="w-full h-3 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="w-5/6 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>

              {/* Footer Meta Details Skeleton */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <div className="w-24 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="w-8 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
