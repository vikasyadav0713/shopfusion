"use client";

import { useFilter } from "@/hooks/useFilter";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const { setFilter } = useFilter();

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-8">
      <button
        onClick={() => setFilter("page", (currentPage - 1).toString())}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setFilter("page", p.toString())}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
            currentPage === p
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
              : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => setFilter("page", (currentPage + 1).toString())}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
