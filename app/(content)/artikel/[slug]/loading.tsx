export default function ArticleDetailLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans pb-28 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* 1. TOP NAV BREADCRUMB SKELETON */}
        <div className="flex items-center justify-between">
          <div className="w-36 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>

        {/* 2. ARTICLE HEADER META SKELETON */}
        <div className="space-y-4 text-left animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-24 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-28 h-4 rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="space-y-2">
            <div className="w-full h-8 sm:h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="w-3/4 h-8 sm:h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Author Card Skeleton */}
          <div className="flex items-center gap-3 pt-2 pb-4 border-b border-slate-200 dark:border-slate-800/80">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="w-36 h-4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-48 h-3 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>

        {/* 3. HERO THUMBNAIL IMAGE SKELETON */}
        <div className="w-full h-64 sm:h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />

        {/* 4. MAIN ARTICLE CONTENT & SIDEBAR TABLE OF CONTENTS SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Table of Contents Sidebar Skeleton */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] space-y-3 shadow-xs animate-pulse">
              <div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-800 pb-2" />
              <div className="space-y-2">
                <div className="w-full h-3 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="w-5/6 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="w-4/5 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="w-3/4 h-3 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </aside>

          {/* Article Text Content Skeleton */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] shadow-xs space-y-4 animate-pulse">
              <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-5/6 h-4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
              
              <div className="w-48 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 pt-4" />
              <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-4/5 h-4 rounded bg-slate-200 dark:bg-slate-800" />

              {/* Code Block Skeleton */}
              <div className="w-full h-36 rounded-xl bg-slate-200 dark:bg-slate-800 my-6" />

              <div className="w-full h-4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="w-11/12 h-4 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </main>

        </div>

        {/* 5. REACTION & SHARE BAR SKELETON */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1015] flex items-center justify-between shadow-xs animate-pulse">
          <div className="flex gap-3">
            <div className="w-24 h-9 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="w-28 h-9 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="flex gap-2">
            <div className="w-20 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="w-20 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

      </div>
    </div>
  );
}
