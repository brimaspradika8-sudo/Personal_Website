export default function StudioArticlesLoading() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#05080E] text-black dark:text-white pb-24 antialiased selection:bg-[#EAB308]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 space-y-6 animate-pulse">
        
        {/* Navigation Back Skeleton */}
        <div className="flex items-center justify-between">
          <div className="w-44 h-9 bg-slate-200 dark:bg-slate-800 border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-40 h-9 bg-amber-400 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
        </div>

        {/* Header Studio Banner Skeleton */}
        <div className="p-6 sm:p-8 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="w-48 h-6 bg-[#166534] border-2 border-black" />
            <div className="w-3/4 h-10 bg-slate-900 dark:bg-white border-2 border-black" />
            <div className="w-full sm:w-2/3 h-4 bg-slate-300 dark:bg-slate-800" />
          </div>
          <div className="w-48 h-14 bg-[#00FF66] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shrink-0" />
        </div>

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between"
            >
              <div className="space-y-2">
                <div className="w-28 h-4 bg-slate-300 dark:bg-slate-800" />
                <div className="w-12 h-8 bg-slate-900 dark:bg-white" />
              </div>
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 border-2 border-black" />
            </div>
          ))}
        </div>

        {/* Article Items List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 bg-white dark:bg-[#0E131F] border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-900 dark:bg-slate-800 border-3 border-black shrink-0 hidden sm:block" />
                <div className="space-y-2 flex-1">
                  <div className="w-24 h-4 bg-amber-400 border border-black" />
                  <div className="w-64 sm:w-96 h-6 bg-slate-900 dark:bg-white" />
                  <div className="w-40 h-4 bg-slate-300 dark:bg-slate-800" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 border-2 border-black" />
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 border-2 border-black" />
                <div className="w-10 h-10 bg-red-400 border-2 border-black" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
