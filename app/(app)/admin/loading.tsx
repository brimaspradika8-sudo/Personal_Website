export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex">
      {/* Sidebar Skeleton */}
      <aside className="hidden lg:flex w-64 flex-col border-r-4 border-black dark:border-white bg-white dark:bg-black p-5 space-y-6 shrink-0">
        <div className="flex items-center gap-3 pb-4 border-b-3 border-black dark:border-white animate-pulse">
          <div className="w-8 h-8 rounded-none bg-[#EAB308] border-2 border-black" />
          <div className="w-32 h-5 rounded-none bg-black dark:bg-white" />
        </div>
        <div className="space-y-3 flex-1 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-full h-10 rounded-none bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white" />
          ))}
        </div>
      </aside>

      {/* Main Panel Content Skeleton */}
      <div className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
        {/* Top Header Bar Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-4 border-black dark:border-white animate-pulse">
          <div className="space-y-2">
            <div className="w-56 h-8 rounded-none bg-[#EAB308] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-72 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-28 h-10 rounded-none bg-[#16A34A] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-32 h-10 rounded-none bg-[#EAB308] border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>

        {/* 4 Overview Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              <div className="flex items-center justify-between">
                <div className="w-24 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-8 h-8 rounded-none bg-[#16A34A] border-2 border-black" />
              </div>
              <div className="w-16 h-8 rounded-none bg-neutral-300 dark:bg-neutral-800 border-2 border-black" />
            </div>
          ))}
        </div>

        {/* Content Tables Skeleton (2 Grid Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black space-y-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex items-center justify-between pb-4 border-b-3 border-black dark:border-white">
                <div className="w-36 h-6 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-20 h-7 rounded-none bg-neutral-300 dark:bg-neutral-800 border-2 border-black" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="p-3.5 rounded-none bg-neutral-100 dark:bg-neutral-900 border-3 border-black dark:border-white flex items-center justify-between">
                    <div className="space-y-1.5 flex-1">
                      <div className="w-3/4 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                      <div className="w-1/2 h-3 rounded-none bg-neutral-200 dark:bg-neutral-900" />
                    </div>
                    <div className="w-16 h-6 rounded-none bg-[#EAB308] border border-black" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
