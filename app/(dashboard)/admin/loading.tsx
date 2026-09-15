export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans p-6 sm:p-10 space-y-8 animate-pulse">
      {/* Top Header Bar Skeleton */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="space-y-2">
          <div className="w-48 h-8 rounded-xl bg-slate-800" />
          <div className="w-72 h-4 rounded bg-slate-800" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800" />
          <div className="w-32 h-8 rounded-full bg-slate-800" />
        </div>
      </div>

      {/* Stats Cards Skeleton (4 Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-slate-800 bg-[#0E1015] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-24 h-4 rounded bg-slate-800" />
              <div className="w-8 h-8 rounded-lg bg-slate-800" />
            </div>
            <div className="w-16 h-8 rounded-xl bg-slate-800" />
            <div className="w-32 h-3 rounded bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Main Content Table/Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-[#0E1015] space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="w-36 h-6 rounded bg-slate-800" />
              <div className="w-20 h-7 rounded-full bg-slate-800" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="p-3 rounded-xl bg-slate-900 flex items-center justify-between">
                  <div className="space-y-1.5 flex-1">
                    <div className="w-3/4 h-4 rounded bg-slate-800" />
                    <div className="w-1/2 h-3 rounded bg-slate-800" />
                  </div>
                  <div className="w-16 h-6 rounded bg-slate-800" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
