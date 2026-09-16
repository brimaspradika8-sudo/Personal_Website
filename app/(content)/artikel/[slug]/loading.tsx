export default function ArticleDetailLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono pb-28 sm:pb-20">
      {/* 1. Header Nav Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b-4 border-black dark:border-white px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-none bg-[#FF0000] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-32 sm:w-40 h-5 rounded-none bg-black dark:bg-white" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-24 h-9 rounded-none bg-[#FF0000] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 space-y-8">
        
        {/* 2. ARTICLE HEADER META SKELETON */}
        <div className="space-y-4 text-left animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-28 h-7 rounded-none bg-[#FFFF00] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-28 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
          </div>

          <div className="space-y-2">
            <div className="w-full h-10 sm:h-14 rounded-none bg-neutral-300 dark:bg-neutral-800 border-3 border-black dark:border-white" />
            <div className="w-3/4 h-10 sm:h-14 rounded-none bg-neutral-300 dark:bg-neutral-800 border-3 border-black dark:border-white" />
          </div>

          {/* Author Card Skeleton */}
          <div className="flex items-center gap-3.5 pt-3 pb-5 border-b-4 border-black dark:border-white">
            <div className="w-12 h-12 rounded-none bg-[#FF0000] border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="w-40 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-56 h-3.5 rounded-none bg-neutral-200 dark:bg-neutral-900" />
            </div>
          </div>
        </div>

        {/* 3. HERO THUMBNAIL IMAGE SKELETON */}
        <div className="w-full h-64 sm:h-96 rounded-none bg-black border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] animate-pulse" />

        {/* 4. MAIN ARTICLE CONTENT & SIDEBAR TABLE OF CONTENTS SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Table of Contents Sidebar Skeleton */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="p-5 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] animate-pulse">
              <div className="w-24 h-5 rounded-none bg-[#FF0000] border-2 border-black" />
              <div className="space-y-2.5 pt-2">
                <div className="w-full h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-5/6 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-4/5 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              </div>
            </div>
          </aside>

          {/* Article Text Content Skeleton */}
          <main className="lg:col-span-3 order-1 lg:order-2">
            <div className="p-6 sm:p-10 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] space-y-4 animate-pulse">
              <div className="w-full h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-full h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-5/6 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-full h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              
              <div className="w-56 h-7 rounded-none bg-[#FFFF00] border-2 border-black my-6" />
              <div className="w-full h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-full h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-4/5 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />

              {/* Code Block Skeleton */}
              <div className="w-full h-36 rounded-none bg-black border-4 border-black dark:border-white my-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" />

              <div className="w-full h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-11/12 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            </div>
          </main>

        </div>

      </div>
    </div>
  );
}
