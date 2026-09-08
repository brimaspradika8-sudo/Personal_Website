export default function ProfileLoading() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-[#F8F9FA] flex flex-col pt-24 pb-12 px-4 sm:px-6">
      
      {/* Header Skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0B1D3A] h-16 shadow-md" />

      {/* Main Layout Skeleton */}
      <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row gap-8">
        
        {/* Left Column Skeleton */}
        <div className="w-full lg:w-1/3 shrink-0">
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center sm:items-start animate-pulse relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E62429]/40 to-[#3A6FF5]/40" />
            
            <div className="w-32 h-32 rounded-full bg-gray-200 mb-6 mx-auto sm:mx-0" />
            <div className="w-48 h-8 rounded-lg bg-gray-200 mb-3 mx-auto sm:mx-0" />
            <div className="w-40 h-4 rounded-md bg-gray-100 mb-6 mx-auto sm:mx-0" />
            
            <div className="flex gap-2 mb-8 mx-auto sm:mx-0">
              <div className="w-20 h-6 bg-red-100 rounded-full" />
              <div className="w-24 h-6 bg-blue-100 rounded-full" />
            </div>

            <div className="w-full h-10 bg-gray-100 rounded-full mb-3" />
            <div className="w-full h-10 bg-gray-50 border border-gray-200 rounded-full" />
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="w-full lg:w-2/3 flex flex-col animate-pulse">
          
          {/* Tabs Skeleton */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-white rounded-2xl border border-gray-100">
            <div className="flex-1 h-12 bg-gray-100 rounded-xl" />
            <div className="flex-1 h-12 bg-gray-50 rounded-xl" />
            <div className="flex-1 h-12 bg-gray-50 rounded-xl" />
            <div className="flex-1 h-12 bg-gray-50 rounded-xl" />
          </div>

          {/* Tab Content Skeleton */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 flex-1 space-y-6">
            <div className="w-48 h-6 bg-gray-200 rounded-md mb-2" />
            <div className="w-64 h-4 bg-gray-100 rounded-md mb-6" />

            <div className="w-full h-20 bg-gray-50 rounded-2xl" />
            <div className="w-full h-20 bg-gray-50 rounded-2xl" />
            <div className="w-full h-20 bg-gray-50 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
