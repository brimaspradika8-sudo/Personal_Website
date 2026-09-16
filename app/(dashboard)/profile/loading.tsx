export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono antialiased pb-20">
      {/* 1. Header Nav Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b-4 border-black dark:border-white px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-none bg-[#EAB308] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-32 sm:w-40 h-5 rounded-none bg-black dark:bg-white" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-24 h-9 rounded-none bg-[#16A34A] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>
      </header>

      {/* Main Container Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 space-y-8 relative z-10">
        
        {/* Profile Header Card Skeleton */}
        <div className="p-6 sm:p-8 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] animate-pulse flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar Circle */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-none bg-[#EAB308] border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0" />
            
            {/* User Info */}
            <div className="space-y-2.5 flex-1 flex flex-col items-center sm:items-start">
              <div className="w-28 h-6 rounded-none bg-[#16A34A] border-2 border-black" />
              <div className="w-48 sm:w-64 h-8 rounded-none bg-neutral-300 dark:bg-neutral-800 border-2 border-black dark:border-white" />
              <div className="w-40 h-5 rounded-none bg-neutral-200 dark:bg-neutral-900" />
            </div>
          </div>

          <div className="w-32 h-10 rounded-none bg-[#EAB308] border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0" />
        </div>

        {/* Settings Box Skeleton */}
        <div className="rounded-none border-4 border-black dark:border-white bg-white dark:bg-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-6 animate-pulse">
          <div className="space-y-2 border-b-3 border-black dark:border-white pb-4">
            <div className="w-44 h-7 rounded-none bg-neutral-300 dark:bg-neutral-800 border-2 border-black" />
            <div className="w-64 h-4 rounded-none bg-neutral-200 dark:bg-neutral-900" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="w-28 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-full h-11 rounded-none bg-neutral-100 dark:bg-neutral-900 border-3 border-black dark:border-white" />
            </div>
            <div className="space-y-2">
              <div className="w-28 h-4 rounded-none bg-neutral-300 dark:bg-neutral-800" />
              <div className="w-full h-11 rounded-none bg-neutral-100 dark:bg-neutral-900 border-3 border-black dark:border-white" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
