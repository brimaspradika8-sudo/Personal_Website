export default function ArticlesLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono antialiased pb-24 selection:bg-[#FF0000] selection:text-white">
      {/* Top Breadcrumb & Header Header Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6 space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="w-48 h-8 rounded-none bg-[#FF0000] border-2 border-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-32 h-8 rounded-none bg-[#FFFF00] border-2 border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
        </div>

        <div className="space-y-2">
          <div className="w-80 sm:w-[500px] h-12 rounded-none bg-[#FFFF00] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]" />
          <div className="w-full max-w-xl h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
        </div>

        {/* Filter & Search Controls Bar Skeleton */}
        <div className="p-4 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-96 h-12 rounded-none bg-neutral-200 dark:bg-neutral-900 border-3 border-black dark:border-white" />
          <div className="w-full md:w-56 h-12 rounded-none bg-neutral-200 dark:bg-neutral-900 border-3 border-black dark:border-white" />
        </div>

        {/* Articles Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-none border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4 p-5 flex flex-col justify-between"
            >
              <div className="w-full h-48 rounded-none bg-black border-2 border-black dark:border-white relative">
                <div className="absolute top-3 left-3 w-8 h-8 rounded-none bg-[#FFFF00] border border-black" />
                <div className="absolute bottom-3 right-3 w-20 h-6 rounded-none bg-[#FFFF00] border border-black" />
              </div>

              <div className="space-y-3 flex-1">
                <div className="w-full h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-4/5 h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-full h-4 rounded-none bg-neutral-200 dark:bg-neutral-900" />
                <div className="w-2/3 h-4 rounded-none bg-neutral-200 dark:bg-neutral-900" />
              </div>

              <div className="pt-3 border-t-3 border-black dark:border-white flex justify-between items-center text-xs">
                <div className="w-24 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-20 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
