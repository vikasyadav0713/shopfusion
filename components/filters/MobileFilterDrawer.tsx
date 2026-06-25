"use client";

import { useState } from "react";
import FilterSidebar from "./FilterSidebar";

type MobileFilterDrawerProps = {
  brands: { brand: string; count: number }[];
  categories: { category: string; count: number }[];
  maxPrice: number;
};

export default function MobileFilterDrawer({ brands, categories, maxPrice }: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="relative w-[320px] max-w-[90vw] h-full bg-slate-50 dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden animate-slide-right transition-colors duration-300">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {/* Reuse the sidebar logic but remove the hidden lg:block classes and un-nest the aside, or just render it and let CSS handle it. Since FilterSidebar has lg:block, we can wrap it or just pass a className override. For simplicity, we'll render a modified version or just duplicate the structure inside if needed, but reusing is better. To reuse, we can remove the hidden class from FilterSidebar. */}
              <div className="[&>aside]:hidden [&>aside]:!block [&>aside]:!w-full [&>aside]:!shadow-none [&>aside]:!border-none [&>aside]:!bg-transparent [&>aside]:!p-0">
                <FilterSidebar brands={brands} categories={categories} maxPrice={maxPrice} />
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
