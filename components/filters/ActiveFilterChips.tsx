"use client";

import { useFilter } from "@/hooks/useFilter";

export default function ActiveFilterChips() {
  const { searchParams, deleteFilter, toggleArrayFilter, clearAllFilters } = useFilter();

  const chips: { label: string; onRemove: () => void }[] = [];

  // Parse Brands
  const brands = searchParams.get("brands")?.split(",") || [];
  brands.forEach(brand => {
    if (brand) chips.push({ label: `Brand: ${brand}`, onRemove: () => toggleArrayFilter("brands", brand) });
  });

  // Parse Categories
  const categories = searchParams.get("categories")?.split(",") || [];
  categories.forEach(cat => {
    if (cat) chips.push({ label: `Category: ${cat}`, onRemove: () => toggleArrayFilter("categories", cat) });
  });

  // Parse Rating
  const rating = searchParams.get("rating");
  if (rating) {
    chips.push({ label: `${rating}★ & Up`, onRemove: () => deleteFilter("rating") });
  }

  // Parse Discount
  const discount = searchParams.get("discount");
  if (discount) {
    chips.push({ label: `${discount}%+ Off`, onRemove: () => deleteFilter("discount") });
  }

  // Parse Stock
  const stock = searchParams.get("stock");
  if (stock === "in_stock") chips.push({ label: "In Stock", onRemove: () => deleteFilter("stock") });
  if (stock === "out_of_stock") chips.push({ label: "Out of Stock", onRemove: () => deleteFilter("stock") });

  // Parse Price
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  if (min && max) {
    chips.push({ label: `₹${min} - ₹${max}`, onRemove: () => { deleteFilter("min"); deleteFilter("max"); } });
  } else if (min) {
    chips.push({ label: `Over ₹${min}`, onRemove: () => deleteFilter("min") });
  } else if (max) {
    chips.push({ label: `Under ₹${max}`, onRemove: () => deleteFilter("max") });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-2 transition-colors">Active Filters:</span>
      {chips.map((chip, i) => (
        <button
          key={i}
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors border border-violet-100 dark:border-violet-800"
        >
          {chip.label}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
      <button
        onClick={clearAllFilters}
        className="text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 underline underline-offset-2 ml-2 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
}
