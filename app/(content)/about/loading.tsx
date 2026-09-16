import React from "react";

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-mono selection:bg-[#EAB308] selection:text-black pb-28 sm:pb-20">
      {/* 1. Sticky Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b-4 border-black dark:border-white px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-none bg-[#EAB308] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            <div className="w-32 sm:w-40 h-5 rounded-none bg-black dark:bg-white" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-20 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            <div className="w-20 h-5 rounded-none bg-neutral-300 dark:bg-neutral-800" />
            <div className="w-20 h-5 rounded-none bg-[#16A34A]" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-24 h-9 rounded-none bg-[#EAB308] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 space-y-12">
        {/* 2. Hero Skeleton */}
        <div className="p-6 sm:p-10 rounded-none border-4 border-black dark:border-white bg-white dark:bg-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] space-y-6 animate-pulse">
          <div className="w-48 h-8 rounded-none bg-[#EAB308] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
          <div className="space-y-3">
            <div className="w-3/4 max-w-2xl h-12 rounded-none bg-neutral-300 dark:bg-neutral-800 border-2 border-black dark:border-white" />
            <div className="w-1/2 max-w-lg h-6 rounded-none bg-[#16A34A] border-2 border-black" />
          </div>
          <div className="w-full max-w-xl h-16 rounded-none bg-neutral-200 dark:bg-neutral-900 border-2 border-black dark:border-white" />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="h-16 rounded-none bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white" />
            <div className="h-16 rounded-none bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white" />
            <div className="h-16 rounded-none bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white" />
            <div className="h-16 rounded-none bg-neutral-100 dark:bg-neutral-900 border-2 border-black dark:border-white" />
          </div>
        </div>

        {/* 3. Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
          <div className="lg:col-span-5 h-[400px] rounded-none border-4 border-black dark:border-white bg-neutral-200 dark:bg-neutral-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" />
          <div className="lg:col-span-7 space-y-4">
            <div className="w-40 h-8 rounded-none bg-[#16A34A] border-2 border-black" />
            <div className="w-full h-32 rounded-none bg-neutral-100 dark:bg-neutral-900 border-3 border-black dark:border-white" />
            <div className="w-full h-32 rounded-none bg-neutral-100 dark:bg-neutral-900 border-3 border-black dark:border-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
