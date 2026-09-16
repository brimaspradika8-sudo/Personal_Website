export default function ArticlesLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-[#FF0000] selection:text-white pb-28 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8 animate-pulse">
        {/* 1. TOP NAV & BREADCRUMB SKELETON */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-28 h-9 rounded-none bg-white dark:bg-black border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
            <div className="w-36 h-9 rounded-none bg-[#FF0000] border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
          </div>
        </div>

        {/* 2. HERO TITLE SECTION SKELETON */}
        <div className="space-y-3 text-left">
          <div className="w-48 h-12 rounded-none bg-black dark:bg-white" />
          <div className="w-full max-w-xl h-5 rounded-none bg-neutral-300 dark:bg-neutral-700" />
        </div>

        {/* 3. SEARCH & SORT BAR SKELETON */}
        <div className="p-4 sm:p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full flex-1 h-11 rounded-none bg-neutral-100 dark:bg-neutral-900 border-3 border-black dark:border-white" />
            <div className="w-full sm:w-48 h-11 rounded-none bg-[#FFFF00] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0" />
          </div>
        </div>

        {/* 4. ARTICLES GRID LIST SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col rounded-none border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              {/* Thumbnail Header Full Bleed */}
              <div className="relative w-full h-48 bg-neutral-900 border-b-4 border-black dark:border-white overflow-hidden shrink-0">
                <div className="absolute top-3 left-3 w-8 h-8 rounded-none bg-[#FFFF00] border-2 border-black" />
                <div className="absolute bottom-3 right-3 w-20 h-6 rounded-none bg-[#FFFF00] border-2 border-black" />
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-full h-6 rounded-none bg-black dark:bg-white" />
                  <div className="w-3/4 h-6 rounded-none bg-black dark:bg-white" />
                  <div className="w-full h-4 rounded-none bg-neutral-300 dark:bg-neutral-700" />
                  <div className="w-4/5 h-4 rounded-none bg-neutral-300 dark:bg-neutral-700" />
                </div>

                {/* Footer Meta Details */}
                <div className="pt-3 border-t-3 border-black dark:border-white flex items-center justify-between">
                  <div className="w-24 h-4 rounded-none bg-neutral-300 dark:bg-neutral-700" />
                  <div className="w-20 h-4 rounded-none bg-neutral-300 dark:bg-neutral-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
