export default function AdminLoading() {
  return (
    <div className="min-h-screen flex bg-[#f5f4f1] text-slate-900">
      {/* Sidebar Skeleton */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#e7e2d9] bg-white p-5 space-y-6 shrink-0">
        <div className="flex items-center gap-3 pb-4 border-b border-[#e7e2d9] animate-pulse">
          <div className="w-9 h-9 rounded-xl bg-[#edf7ef] border border-[#cfe6d8]" />
          <div className="space-y-1.5 flex-1">
            <div className="w-24 h-4 rounded-md bg-slate-200" />
            <div className="w-16 h-3 rounded-md bg-slate-100" />
          </div>
        </div>
        <div className="space-y-2.5 flex-1 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-full h-10 rounded-xl bg-[#faf8f4] border border-[#e7e2d9]"
            />
          ))}
        </div>
        <div className="pt-4 border-t border-[#e7e2d9] animate-pulse flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200" />
          <div className="w-28 h-4 rounded-md bg-slate-200" />
        </div>
      </aside>

      {/* Main Panel Content Skeleton */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Header Skeleton */}
        <header className="h-20 shrink-0 flex items-center justify-between border-b border-[#e7e2d9] bg-white/80 px-4 sm:px-6 lg:px-8">
          <div className="space-y-1.5 animate-pulse">
            <div className="w-20 h-3 rounded bg-slate-200" />
            <div className="w-44 h-6 rounded-md bg-slate-300" />
          </div>
          <div className="w-32 h-9 rounded-xl bg-[#f1f9f3] border border-[#d9d1c5] animate-pulse" />
        </header>

        {/* Content Area Skeleton */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Welcome Card Banner Skeleton */}
            <div className="flex flex-col md:flex-row justify-between gap-6 rounded-2xl border border-[#e7e2d9] bg-white p-5 shadow-[0_18px_38px_rgba(15,23,42,0.04)] animate-pulse">
              <div className="space-y-2.5">
                <div className="w-24 h-3 rounded bg-slate-200" />
                <div className="w-48 h-9 rounded-xl bg-[#edf7ef] border border-[#cfe6d8]" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-10 rounded-xl bg-[#1F6F52]" />
                <div className="w-36 h-10 rounded-xl bg-[#f8f5ef] border border-[#d9d1c5]" />
              </div>
            </div>

            {/* 4 Metric Tiles Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#e7e2d9] bg-white p-5 space-y-4 shadow-[0_18px_38px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-24 h-3 rounded bg-slate-200" />
                    <div className="w-10 h-10 rounded-xl bg-[#edf7ef]" />
                  </div>
                  <div className="w-16 h-8 rounded-lg bg-slate-300" />
                  <div className="w-20 h-5 rounded-full bg-[#f8f5ef] border border-[#d9d1c5]" />
                </div>
              ))}
            </div>

            {/* 2 Recent Sections Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
              {[1, 2].map((i) => (
                <section
                  key={i}
                  className="rounded-2xl border border-[#e7e2d9] bg-white p-5 space-y-4 shadow-[0_18px_38px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-[#eee7dd] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#edf7ef]" />
                      <div className="w-32 h-5 rounded-md bg-slate-300" />
                    </div>
                    <div className="w-20 h-7 rounded-xl bg-[#f8f5ef] border border-[#d9d1c5]" />
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#e7e2d9] bg-[#faf8f4] p-3"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-11 h-11 rounded-xl bg-slate-200" />
                          <div className="space-y-1.5 flex-1">
                            <div className="w-3/4 h-4 rounded bg-slate-300" />
                            <div className="w-1/3 h-3 rounded bg-slate-200" />
                          </div>
                        </div>
                        <div className="w-14 h-7 rounded-lg bg-[#1F6F52]" />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
