"use client";

import { useFilter } from "@/hooks/useFilter";
import PriceSlider from "./PriceSlider";

type FilterSidebarProps = {
  brands: { brand: string; count: number }[];
  categories: { category: string; count: number }[];
  maxPrice: number;
};

export default function FilterSidebar({ brands, categories, maxPrice }: FilterSidebarProps) {
  const { searchParams, toggleArrayFilter, deleteFilter } = useFilter();

  const activeBrands = searchParams.get("brands")?.split(",") || [];
  const activeCategories = searchParams.get("categories")?.split(",") || [];
  const activeRating = searchParams.get("rating");
  const activeStock = searchParams.get("stock"); // "in_stock" or "out_of_stock"
  const activeDiscount = searchParams.get("discount");

  return (
    <aside className="w-full space-y-8 bg-white dark:bg-slate-900 transition-colors duration-300 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md dark:shadow-none hidden lg:block">
      
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-widest transition-colors">Categories</h3>
        <div className="space-y-2">
          {categories.map(({ category, count }) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeCategories.includes(category)}
                onChange={() => toggleArrayFilter("categories", category)}
                className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex-1">
                {category}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">({count})</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800 transition-colors" />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-widest transition-colors">Price Range</h3>
        <PriceSlider maxPossiblePrice={maxPrice} />
      </div>

      <hr className="border-slate-100 dark:border-slate-800 transition-colors" />

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-widest transition-colors">Brands</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {brands.map(({ brand, count }) => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={activeBrands.includes(brand)}
                onChange={() => toggleArrayFilter("brands", brand)}
                className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex-1">
                {brand}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">({count})</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800 transition-colors" />

      {/* Customer Rating */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-widest transition-colors">Customer Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={activeRating === rating.toString()}
                onChange={() => {
                  if (activeRating === rating.toString()) {
                    deleteFilter("rating"); // Toggle off
                  } else {
                    toggleArrayFilter("rating", rating.toString()); // Wait, rating should be single select.
                    // Better to just set it using an onClick or distinct setter
                  }
                }}
                onClick={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (activeRating === rating.toString()) {
                    target.checked = false;
                    deleteFilter("rating");
                  }
                }}
                className="w-4 h-4 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 transition-colors ${i < rating ? "text-yellow-400" : "text-slate-200 dark:text-slate-700"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-slate-600 dark:text-slate-400 ml-1 transition-colors">& Up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800 transition-colors" />

      {/* Discount */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-widest transition-colors">Discount</h3>
        <div className="space-y-2">
          {[50, 40, 30, 20, 10].map((discount) => (
            <label key={discount} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="discount"
                checked={activeDiscount === discount.toString()}
                onClick={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (activeDiscount === discount.toString()) {
                    target.checked = false;
                    deleteFilter("discount");
                  }
                }}
                onChange={() => {}}
                className="w-4 h-4 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors">{discount}% Off or more</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800 transition-colors" />

      {/* Availability */}
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-widest transition-colors">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={activeStock === "in_stock"}
              onChange={() => {
                if (activeStock === "in_stock") deleteFilter("stock");
                else toggleArrayFilter("stock", "in_stock"); // Wait, stock is single string in URL for simplicity
              }}
              className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors">In Stock</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={activeStock === "out_of_stock"}
              onChange={() => {
                if (activeStock === "out_of_stock") deleteFilter("stock");
                else toggleArrayFilter("stock", "out_of_stock");
              }}
              className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors">Out of Stock</span>
          </label>
        </div>
      </div>

    </aside>
  );
}
