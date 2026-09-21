export default function ArticleDetailLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white antialiased pb-24 selection:bg-[#EAB308] selection:text-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8 animate-pulse">
        {/* 1. TOP NAV BREADCRUMB SKELETON */}
        <div className="flex items-center justify-between">
          <div className="w-48 h-10 rounded-none bg-white dark:bg-black border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
          <div className="flex gap-2">
            <div className="w-24 h-10 rounded-none bg-[#FFFF00] border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-10 h-10 rounded-none bg-white dark:bg-black border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>

        {/* 2. ARTICLE HEADER META SKELETON */}
        <div className="space-y-4 text-left">
          <div className="flex gap-3">
            <div className="w-24 h-7 rounded-none bg-[#FFFF00] border-2 border-black" />
            <div className="w-36 h-7 rounded-none bg-neutral-300 dark:bg-neutral-800 border-2 border-black" />
          </div>

          {/* Title Headline Skeleton */}
          <div className="w-full sm:w-5/6 h-12 sm:h-16 rounded-none bg-black dark:bg-white" />
          <div className="w-3/4 h-10 rounded-none bg-neutral-300 dark:bg-neutral-800" />

          {/* Author Card Skeleton */}
          <div className="p-4 rounded-none border-3 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#166534] border-2 border-black shrink-0" />
              <div className="space-y-1">
                <div className="w-36 h-5 rounded-none bg-black dark:bg-white" />
                <div className="w-48 h-4 rounded-none bg-neutral-300 dark:bg-neutral-700" />
              </div>
            </div>
            <div className="w-28 h-8 rounded-none bg-[#FFFF00] border-2 border-black" />
          </div>
        </div>

        {/* 3. HERO THUMBNAIL SKELETON */}
        <div className="w-full h-72 sm:h-[400px] rounded-none border-4 border-black dark:border-white bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative overflow-hidden" />

        {/* 4. AUDIO PLAYER & AI SUMMARY BOX SKELETON */}
        <div className="p-5 rounded-none border-4 border-black dark:border-white bg-[#FFFF00] text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="w-48 h-6 rounded-none bg-black text-white" />
          <div className="w-full h-12 rounded-none bg-white border-3 border-black" />
        </div>

        {/* 5. CONTENT GRID SKELETON (TOC + ARTICLE TEXT) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
          <aside className="lg:col-span-1 space-y-3">
            <div className="p-4 rounded-none border-3 border-black dark:border-white bg-white dark:bg-black space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-32 h-6 rounded-none bg-[#166534]" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-4/5 h-4 bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-full h-4 bg-neutral-300 dark:bg-neutral-800" />
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="p-8 sm:p-12 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <div className="w-full h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-full h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-3/4 h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-full h-40 rounded-none bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white" />
              <div className="w-full h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-5/6 h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
