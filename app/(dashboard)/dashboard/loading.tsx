export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono antialiased pb-20">
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

      {/* 2. Hero Section Skeleton */}
      <section className="relative min-h-[85vh] sm:min-h-[92vh] flex items-center justify-center pt-24 sm:pt-28 pb-12 overflow-hidden text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 w-full flex flex-col items-center justify-center text-center relative z-10 py-8 sm:py-12 space-y-6 animate-pulse">
          
          {/* Headline Skeleton */}
          <div className="space-y-4 w-full flex flex-col items-center">
            <div className="w-64 sm:w-96 h-12 sm:h-16 rounded-none bg-[#EAB308] border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-3/4 max-w-xl h-12 sm:h-16 rounded-none bg-neutral-300 dark:bg-neutral-800 border-3 border-black dark:border-white" />
            <div className="w-1/2 max-w-md h-12 sm:h-16 rounded-none bg-neutral-300 dark:bg-neutral-800 border-3 border-black dark:border-white" />
          </div>

          {/* Subtitle Paragraph Skeleton */}
          <div className="w-5/6 max-w-xl h-6 rounded-none bg-neutral-300 dark:bg-neutral-800 pt-2" />

          {/* CTA Buttons Skeleton */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="w-44 h-12 rounded-none bg-[#EAB308] border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-40 h-12 rounded-none bg-[#16A34A] border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>
      </section>

      {/* 3. Latest Articles Section Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-pulse">
        <div className="space-y-2 text-left">
          <div className="w-64 h-8 rounded-none bg-[#16A34A] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-72 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Featured Hero Article Skeleton */}
          <div className="lg:col-span-7 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black p-6 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] min-h-[420px] flex flex-col justify-between">
            <div className="w-full h-56 rounded-none bg-black border-2 border-black dark:border-white" />
            <div className="space-y-3">
              <div className="w-full h-7 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-4/5 h-7 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-full h-4 rounded-none bg-neutral-200 dark:bg-neutral-900" />
            </div>
            <div className="pt-4 border-t-3 border-black dark:border-white flex justify-between items-center">
              <div className="w-24 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-20 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            </div>
          </div>

          {/* Secondary Stacked Articles Skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black p-5 space-y-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-none bg-black border-2 border-black dark:border-white shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="w-full h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                    <div className="w-3/4 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                    <div className="w-1/2 h-3.5 rounded-none bg-neutral-200 dark:bg-neutral-900" />
                  </div>
                </div>
                <div className="pt-2 border-t-3 border-black dark:border-white flex justify-between items-center text-xs">
                  <div className="w-20 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                  <div className="w-16 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
