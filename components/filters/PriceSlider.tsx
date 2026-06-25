"use client";

import { useFilter } from "@/hooks/useFilter";
import { useState, useEffect } from "react";

export default function PriceSlider({ maxPossiblePrice }: { maxPossiblePrice: number }) {
  const { searchParams, setFilter, deleteFilter } = useFilter();
  
  const minParam = searchParams.get("min");
  const maxParam = searchParams.get("max");

  const [min, setMin] = useState<string>(minParam || "");
  const [max, setMax] = useState<string>(maxParam || "");

  // Sync state if URL changes externally
  useEffect(() => {
    setMin(minParam || "");
    setMax(maxParam || "");
  }, [minParam, maxParam]);

  const applyPrice = () => {
    if (min) setFilter("min", min);
    else deleteFilter("min");
    
    if (max) setFilter("max", max);
    else deleteFilter("max");
  };

  const clearPrice = () => {
    setMin("");
    setMax("");
    deleteFilter("min");
    deleteFilter("max");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm">₹</span>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="Min"
            className="w-full pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          />
        </div>
        <span className="text-slate-400">-</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm">₹</span>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="Max"
            className="w-full pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={applyPrice}
          className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          Apply
        </button>
        {(minParam || maxParam) && (
          <button
            onClick={clearPrice}
            className="px-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-2 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="pt-2 flex flex-wrap gap-2">
        <button onClick={() => { setMin(""); setMax("500"); applyPrice(); }} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Under ₹500</button>
        <button onClick={() => { setMin("500"); setMax("1000"); applyPrice(); }} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">₹500 - ₹1000</button>
        <button onClick={() => { setMin("1000"); setMax("5000"); applyPrice(); }} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">₹1000 - ₹5000</button>
        <button onClick={() => { setMin("5000"); setMax(""); applyPrice(); }} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Over ₹5000</button>
      </div>
    </div>
  );
}
