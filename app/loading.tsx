export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono antialiased selection:bg-[#FF0000] selection:text-white pb-20">
      {/* 1. Header Nav Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b-4 border-black dark:border-white px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-none bg-[#FF0000] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-36 sm:w-44 h-5 rounded-none bg-black dark:bg-white" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-20 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            <div className="w-20 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            <div className="w-20 h-5 rounded-none bg-[#FFFF00]" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-24 h-9 rounded-none bg-[#FFFF00] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>
      </header>

      {/* Main Container Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 space-y-10 relative z-10">
        {/* Hero Card Skeleton */}
        <div className="p-8 sm:p-12 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] space-y-6 animate-pulse">
          <div className="w-40 h-6 rounded-none bg-[#FF0000] border-2 border-black text-white" />
          <div className="space-y-3">
            <div className="w-3/4 h-12 rounded-none bg-neutral-300 dark:bg-neutral-800 border-2 border-black dark:border-white" />
            <div className="w-1/2 h-12 rounded-none bg-neutral-300 dark:bg-neutral-800 border-2 border-black dark:border-white" />
          </div>
          <div className="w-5/6 h-5 rounded-none bg-neutral-200 dark:bg-neutral-900" />
          <div className="flex items-center gap-4 pt-4">
            <div className="w-40 h-11 rounded-none bg-[#FFFF00] border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-32 h-11 rounded-none bg-[#166534] border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>

        {/* Content Section Title Skeleton */}
        <div className="space-y-2 animate-pulse">
          <div className="w-48 h-8 rounded-none bg-[#FF0000] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-72 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-none border-4 border-black dark:border-white bg-white dark:bg-black p-5 space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] animate-pulse"
            >
              <div className="w-full h-44 rounded-none bg-black border-2 border-black dark:border-white" />
              <div className="space-y-2">
                <div className="w-full h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-3/4 h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              </div>
              <div className="w-full h-4 rounded-none bg-neutral-200 dark:bg-neutral-900" />
              <div className="pt-3 border-t-3 border-black dark:border-white flex justify-between items-center">
                <div className="w-24 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-16 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
