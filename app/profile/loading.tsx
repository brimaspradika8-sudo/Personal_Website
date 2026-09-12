export default function ProfileLoading() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-[#0A0A0B] text-[#F1EFE9] flex flex-col pt-24 pb-12 px-4 sm:px-6">
      
      {/* Header Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-white/10 h-16 shadow-md" />

      {/* Main Layout Skeleton */}
      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-8">
        
        {/* Left Column Skeleton */}
        <div className="w-full lg:w-1/3 shrink-0">
          <div className="bg-[#121214] rounded-3xl p-8 border border-white/10 flex flex-col items-center sm:items-start animate-pulse relative overflow-hidden">
            {/* Red Solid Accent Gradient matching Profile Card */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#DC2626] via-[#EF4444] to-[#B91C1C]" />
            
            <div className="w-32 h-32 rounded-full bg-white/10 mb-6 mx-auto sm:mx-0" />
            <div className="w-48 h-8 rounded-lg bg-white/10 mb-3 mx-auto sm:mx-0" />
            <div className="w-40 h-4 rounded-md bg-white/5 mb-6 mx-auto sm:mx-0" />
            
            <div className="flex gap-2 mb-8 mx-auto sm:mx-0">
              <div className="w-20 h-6 bg-[#DC2626]/20 rounded-full" />
              <div className="w-24 h-6 bg-white/10 rounded-full" />
            </div>

            <div className="w-full h-10 bg-white/10 rounded-full mb-3" />
            <div className="w-full h-10 bg-white/5 border border-white/10 rounded-full" />
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="w-full lg:w-2/3 flex flex-col animate-pulse">
          
          {/* Tabs Skeleton */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-[#121214] rounded-2xl border border-white/10">
            <div className="flex-1 h-12 bg-white/10 rounded-xl" />
            <div className="flex-1 h-12 bg-white/5 rounded-xl" />
            <div className="flex-1 h-12 bg-white/5 rounded-xl" />
            <div className="flex-1 h-12 bg-white/5 rounded-xl" />
          </div>

          {/* Tab Content Skeleton */}
          <div className="bg-[#121214] rounded-3xl p-6 sm:p-8 border border-white/10 flex-1 space-y-6">
            <div className="w-48 h-6 bg-white/10 rounded-md mb-2" />
            <div className="w-64 h-4 bg-white/5 rounded-md mb-6" />

            <div className="w-full h-20 bg-white/5 rounded-2xl" />
            <div className="w-full h-20 bg-white/5 rounded-2xl" />
            <div className="w-full h-20 bg-white/5 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
