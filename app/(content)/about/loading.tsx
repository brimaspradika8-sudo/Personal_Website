export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono antialiased pb-24 selection:bg-[#FF0000] selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-10 animate-pulse">
        {/* Top Hero Banner & Profile Header Skeleton */}
        <div className="rounded-none border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="w-full h-44 sm:h-64 bg-black border-b-4 border-black dark:border-white" />
          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-24">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#FF0000] border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0" />
              <div className="flex gap-3">
                <div className="w-36 h-10 rounded-none bg-[#FFFF00] border-3 border-black" />
                <div className="w-32 h-10 rounded-none bg-[#FF0000] border-3 border-black" />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="w-72 sm:w-96 h-10 rounded-none bg-black dark:bg-white" />
              <div className="w-full max-w-2xl h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-3/4 max-w-xl h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            </div>
          </div>
        </div>

        {/* Quick Metrics Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-none border-3 border-black dark:border-white bg-white dark:bg-black space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              <div className="w-20 h-8 rounded-none bg-[#FFFF00] border border-black" />
              <div className="w-28 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            </div>
          ))}
        </div>

        {/* Bio Section & Skills Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-8 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-48 h-8 rounded-none bg-[#FF0000]" />
            <div className="space-y-3">
              <div className="w-full h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-full h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-4/5 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            </div>
          </div>

          <div className="p-8 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-40 h-8 rounded-none bg-[#FFFF00]" />
            <div className="space-y-2">
              <div className="w-full h-8 rounded-none bg-neutral-200 dark:bg-neutral-900 border border-black" />
              <div className="w-full h-8 rounded-none bg-neutral-200 dark:bg-neutral-900 border border-black" />
              <div className="w-full h-8 rounded-none bg-neutral-200 dark:bg-neutral-900 border border-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
