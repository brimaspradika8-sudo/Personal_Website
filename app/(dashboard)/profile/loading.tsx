export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono antialiased pb-24 selection:bg-[#EAB308] selection:text-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-8 animate-pulse">
        {/* Profile Card Header Skeleton */}
        <div className="rounded-none border-4 border-black dark:border-white bg-white dark:bg-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="w-full h-40 bg-black border-b-4 border-black dark:border-white" />
          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#166534] border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0" />
              <div className="w-32 h-9 rounded-none bg-[#FFFF00] border-2 border-black" />
            </div>

            <div className="space-y-2 pt-2">
              <div className="w-56 h-8 rounded-none bg-black dark:bg-white" />
              <div className="w-44 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            </div>
          </div>
        </div>

        {/* Membership Status Box Skeleton */}
        <div className="p-6 rounded-none border-4 border-black dark:border-white bg-[#FFFF00] text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="w-48 h-7 rounded-none bg-black text-white" />
          <div className="w-full h-4 rounded-none bg-black/30" />
          <div className="w-40 h-10 rounded-none bg-[#166534] border-2 border-black" />
        </div>

        {/* Saved Bookmarks Card Skeleton */}
        <div className="p-6 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-4">
          <div className="w-44 h-7 rounded-none bg-[#166534] text-white" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-none border-3 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 space-y-2">
                <div className="w-full h-5 bg-neutral-300 dark:bg-neutral-800" />
                <div className="w-24 h-3 bg-neutral-300 dark:bg-neutral-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
