export default function ProfileLoading() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-[#12160F] font-sans text-[#F1EFE9] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#1A211A] border border-[#2A2F26] rounded-2xl p-6 sm:p-8 space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-9 w-40 bg-[#212A20] rounded-lg" />
          <div className="h-7 w-32 bg-[#3B5D42]/30 rounded-full" />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-[#2A2F26]">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#212A20] border border-[#2A2F26] shrink-0" />
          <div className="space-y-3 flex-1 w-full text-center sm:text-left">
            <div className="h-5 w-44 bg-[#3B5D42]/30 rounded-full mx-auto sm:mx-0" />
            <div className="h-8 w-60 bg-[#212A20] rounded-lg mx-auto sm:mx-0" />
            <div className="h-4 w-48 bg-[#212A20] rounded-md mx-auto sm:mx-0" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="h-10 bg-[#212A20] rounded-lg" />
          <div className="h-10 bg-[#212A20] rounded-lg" />
          <div className="h-10 bg-[#212A20] rounded-lg" />
          <div className="h-10 bg-[#212A20] rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="h-20 bg-[#212A20] rounded-xl" />
          <div className="h-20 bg-[#212A20] rounded-xl" />
          <div className="h-20 bg-[#212A20] rounded-xl sm:col-span-2" />
        </div>
      </div>
    </div>
  );
}
