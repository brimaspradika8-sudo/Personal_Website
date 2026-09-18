export default function ArticlesLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0D14] text-slate-900 dark:text-white font-sans selection:bg-[#EAB308] selection:text-slate-950 pb-28 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8 animate-pulse">
        
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-28 h-9 rounded-full bg-[#166534] border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-44 h-9 rounded-full bg-[#EAB308] border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>
        
        <div className="space-y-3 text-left">
          <div className="w-48 h-7 rounded-full bg-[#EAB308] border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          <div className="w-80 sm:w-[500px] h-12 rounded-xl bg-slate-950 dark:bg-white" />
          <div className="w-full max-w-xl h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
        </div>

        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-900 dark:border-white" />
            <div className="w-full sm:w-48 h-11 rounded-xl bg-[#EAB308] border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col rounded-3xl border-3 border-slate-900 dark:border-white bg-white dark:bg-[#0E121D] overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >

              <div className="relative w-full h-48 bg-slate-900 border-b-3 border-slate-900 dark:border-white overflow-hidden shrink-0">
                <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-[#EAB308] border-2 border-slate-900" />
                <div className="absolute top-3 right-3 w-20 h-6 rounded-xl bg-[#166534] border-2 border-slate-900" />
                <div className="absolute bottom-3 right-3 w-20 h-6 rounded-xl bg-[#EAB308] border-2 border-slate-900" />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-full h-6 rounded-md bg-slate-950 dark:bg-white" />
                  <div className="w-3/4 h-6 rounded-md bg-slate-950 dark:bg-white" />
                  <div className="w-full h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
                  <div className="w-4/5 h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
                </div>

                <div className="pt-3 border-t-2 border-slate-900 dark:border-white flex items-center justify-between">
                  <div className="w-24 h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
                  <div className="w-20 h-4 rounded-md bg-slate-300 dark:bg-slate-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
