export default function ArtikelLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-950 dark:text-white font-mono antialiased pb-28 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 space-y-8">
        
        {/* 1. TOP NAV BREADCRUMB SKELETON */}
        <div className="flex items-center justify-between">
          <div className="w-40 h-9 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900 animate-pulse shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-28 h-9 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900 animate-pulse shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
        </div>

        {/* 2. HERO TITLE SECTION SKELETON */}
        <div className="space-y-3 text-left animate-pulse">
          <div className="w-72 h-10 rounded-xl bg-amber-400 border-2 border-slate-900" />
          <div className="w-full max-w-lg h-5 rounded bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* 3. SEARCH & FILTER BAR SKELETON */}
        <div className="p-5 rounded-2xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-4 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full flex-1 h-11 rounded-xl bg-slate-200 dark:bg-slate-800 border-2 border-slate-900" />
            <div className="w-full sm:w-40 h-11 rounded-xl bg-slate-200 dark:bg-slate-800 border-2 border-slate-900" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-24 h-8 rounded-lg bg-slate-300 dark:bg-slate-700 border-2 border-slate-900 shrink-0" />
            ))}
          </div>
        </div>

        {/* 4. ARTICLES GRID CARDS SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] p-5 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] animate-pulse"
            >
              {/* Thumbnail Skeleton */}
              <div className="w-full h-44 rounded-xl bg-slate-300 dark:bg-slate-700 border-2 border-slate-900 relative" />

              {/* Title & Content Excerpt Skeleton */}
              <div className="space-y-2 flex-1">
                <div className="w-full h-6 rounded bg-slate-300 dark:bg-slate-700" />
                <div className="w-3/4 h-6 rounded bg-slate-300 dark:bg-slate-700" />
                <div className="pt-2 space-y-1.5">
                  <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="w-5/6 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>

              {/* Footer Meta Details Skeleton */}
              <div className="pt-3 border-t-2 border-slate-900 dark:border-white flex items-center justify-between">
                <div className="w-24 h-4 rounded bg-slate-300 dark:bg-slate-700" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-4 rounded bg-slate-300 dark:bg-slate-700" />
                  <div className="w-10 h-4 rounded bg-slate-300 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

