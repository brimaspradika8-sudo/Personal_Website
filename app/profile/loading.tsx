export default function ProfileLoading() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-stone-950 font-sans text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-stone-900/80 border border-amber-400/20 rounded-3xl p-6 sm:p-8 space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-9 w-40 bg-white/10 rounded-2xl" />
          <div className="h-7 w-32 bg-amber-500/20 rounded-full" />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-white/10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-stone-800 border-2 border-amber-400/40 shrink-0" />
          <div className="space-y-3 flex-1 w-full text-center sm:text-left">
            <div className="h-5 w-44 bg-emerald-500/20 rounded-full mx-auto sm:mx-0" />
            <div className="h-8 w-60 bg-white/15 rounded-xl mx-auto sm:mx-0" />
            <div className="h-4 w-48 bg-white/10 rounded-lg mx-auto sm:mx-0" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="h-10 bg-white/10 rounded-xl" />
          <div className="h-10 bg-white/10 rounded-xl" />
          <div className="h-10 bg-white/10 rounded-xl" />
          <div className="h-10 bg-white/10 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="h-20 bg-white/5 rounded-2xl" />
          <div className="h-20 bg-white/5 rounded-2xl" />
          <div className="h-20 bg-white/5 rounded-2xl sm:col-span-2" />
        </div>
      </div>
    </div>
  );
}
