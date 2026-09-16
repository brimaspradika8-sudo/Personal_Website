export default function ArtikelLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono antialiased pb-28 sm:pb-20">
      {/* 1. Header Nav Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b-4 border-black dark:border-white px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-none bg-[#EAB308] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-32 sm:w-40 h-5 rounded-none bg-black dark:bg-white" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-20 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            <div className="w-20 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            <div className="w-20 h-5 rounded-none bg-[#16A34A]" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-24 h-9 rounded-none bg-[#EAB308] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 space-y-8">
        
        {/* 2. HERO TITLE SECTION SKELETON */}
        <div className="space-y-3 text-left animate-pulse">
          <div className="w-64 sm:w-80 h-10 rounded-none bg-[#EAB308] border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
          <div className="w-full max-w-lg h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
        </div>

        {/* 3. SEARCH BAR SKELETON */}
        <div className="p-5 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full flex-1 h-12 rounded-none bg-neutral-100 dark:bg-neutral-900 border-3 border-black dark:border-white" />
            <div className="w-full sm:w-44 h-12 rounded-none bg-[#16A34A] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>

        {/* 4. ARTICLES GRID CARDS SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col rounded-none border-4 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] animate-pulse"
            >
              {/* Thumbnail Skeleton */}
              <div className="w-full h-48 rounded-none bg-black border-2 border-black dark:border-white" />

              {/* Title & Content Excerpt Skeleton */}
              <div className="space-y-2 flex-1">
                <div className="w-full h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-3/4 h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="pt-2 space-y-1.5">
                  <div className="w-full h-3.5 rounded-none bg-neutral-200 dark:bg-neutral-900" />
                  <div className="w-5/6 h-3.5 rounded-none bg-neutral-200 dark:bg-neutral-900" />
                </div>
              </div>

              {/* Footer Meta Details Skeleton */}
              <div className="pt-3 border-t-3 border-black dark:border-white flex items-center justify-between">
                <div className="w-24 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
