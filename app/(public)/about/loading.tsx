export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-28 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-10 sm:space-y-14 animate-pulse">
        {/* TOP NAV SKELETON */}
        <div className="w-40 h-10 border-3 border-black dark:border-white bg-neutral-200 dark:bg-neutral-800" />
        
        {/* HERO HEADER BANNER SKELETON */}
        <section className="relative p-6 sm:p-10 border-4 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] space-y-6">
          <div className="w-56 h-8 bg-neutral-300 dark:bg-neutral-700 border-3 border-black" />
          <div className="space-y-3">
            <div className="w-3/4 max-w-xl h-12 sm:h-16 bg-neutral-300 dark:bg-neutral-600" />
            <div className="w-full max-w-3xl h-6 bg-neutral-300 dark:bg-neutral-700" />
            <div className="w-2/3 max-w-xl h-6 bg-neutral-300 dark:bg-neutral-700" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="p-3.5 border-3 border-black dark:border-white bg-neutral-200 dark:bg-neutral-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1">
                <div className="w-16 h-4 bg-neutral-300 dark:bg-neutral-600" />
                <div className="w-24 h-5 bg-neutral-400 dark:bg-neutral-500" />
              </div>
            ))}
          </div>
          
          <div className="flex gap-3 pt-3">
            <div className="w-40 h-12 bg-neutral-300 dark:bg-neutral-700 border-3 border-black" />
            <div className="w-40 h-12 bg-neutral-300 dark:bg-neutral-700 border-3 border-black" />
          </div>
        </section>

        {/* ABOUT ME STORY SKELETON */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Avatar Cutout & Quote Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="border-4 border-black dark:border-white bg-neutral-200 dark:bg-neutral-800 p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-full h-[320px] sm:h-[380px] bg-neutral-300 dark:bg-neutral-700 border-3 border-black" />
              <div className="pt-4 space-y-2 flex flex-col items-center">
                <div className="w-48 h-6 bg-neutral-300 dark:bg-neutral-600" />
                <div className="w-32 h-4 bg-neutral-300 dark:bg-neutral-600" />
              </div>
            </div>
            <div className="p-5 border-4 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="w-32 h-4 bg-neutral-300 dark:bg-neutral-700" />
              <div className="w-full h-10 bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
          
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="w-40 h-8 bg-neutral-300 dark:bg-neutral-700 border-3 border-black" />
              <div className="w-full h-10 bg-neutral-300 dark:bg-neutral-800" />
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border-3 border-black dark:border-white bg-neutral-200 dark:bg-neutral-800 h-24" />
              <div className="w-full h-4 bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-full h-4 bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-5/6 h-4 bg-neutral-300 dark:bg-neutral-800" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 border-3 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 h-24" />
              <div className="p-4 border-3 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 h-24" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
