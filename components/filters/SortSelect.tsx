"use client";

import { useFilter } from "@/hooks/useFilter";

export default function SortSelect({ defaultValue }: { defaultValue: string }) {
  const { setFilter } = useFilter();

  return (
    <select
      id="sort"
      name="sort"
      value={defaultValue}
      onChange={(e) => setFilter("sort", e.target.value)}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 cursor-pointer transition-colors duration-300"
    >
      <option value="newest">Newest Arrivals</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Highest Rated</option>
      <option value="popular">Most Popular</option>
      <option value="name-asc">Alphabetical: A-Z</option>
      <option value="name-desc">Alphabetical: Z-A</option>
      <option value="discount">Highest Discount</option>
    </select>
  );
}
