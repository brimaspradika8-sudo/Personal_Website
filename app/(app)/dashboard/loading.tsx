export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F2F3F4] dark:bg-[#0B0F17] pb-32 md:pb-0">
      {/* MOCK NAVBAR */}
      <div className="fixed top-2.5 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl">
        <div className="h-12 sm:h-14 rounded-full border-2 sm:border-3 border-black dark:border-white bg-neutral-200 dark:bg-neutral-800 animate-pulse shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
      </div>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-start overflow-hidden text-center min-h-[85vh] animate-pulse">
        <div className="w-full pt-[72px] sm:pt-[88px]">
          <div className="h-8 sm:h-10 border-y-2 border-black dark:border-white bg-neutral-300 dark:bg-neutral-800" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 w-full flex flex-col items-center justify-center text-center relative z-10 pt-8 sm:pt-14 pb-8 sm:pb-12 space-y-6">
          <div className="w-48 h-12 bg-neutral-300 dark:bg-neutral-800" />
          <div className="w-full max-w-3xl h-24 sm:h-32 bg-neutral-300 dark:bg-neutral-800" />
          <div className="w-3/4 max-w-2xl h-10 bg-neutral-300 dark:bg-neutral-800" />
          
          <div className="flex gap-4 pt-4">
            <div className="w-40 sm:w-48 h-12 rounded-xl bg-neutral-300 dark:bg-neutral-800 border-2 sm:border-3 border-black dark:border-white" />
            <div className="w-40 sm:w-48 h-12 rounded-xl bg-neutral-300 dark:bg-neutral-800 border-2 sm:border-3 border-black dark:border-white" />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16 md:py-20 border-t-2 border-black dark:border-white animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          <div className="lg:col-span-5 flex justify-center items-start">
            <div className="w-full max-w-[260px] aspect-[4/5] sm:max-w-md sm:aspect-square rounded-2xl bg-neutral-300 dark:bg-neutral-800 border-3 border-black dark:border-white" />
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border-2 border-black dark:border-white p-5 sm:p-6 space-y-5 bg-neutral-200 dark:bg-neutral-900 h-[400px]" />
          </div>
        </div>
      </section>
    </div>
  );
}
