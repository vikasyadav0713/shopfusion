"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";

type ProductItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

type ProductGalleryProps = {
  products: ProductItem[];
  categories: string[];
};

export default function ProductGallery({ products, categories }: ProductGalleryProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "All");

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white transition-colors sm:text-2xl">Latest products</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Freshly added to the store</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition duration-300 ${
              activeCategory === category
                ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900 shadow"
                : "border-slate-200 bg-white/70 text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors duration-300 p-10 text-center text-slate-600 dark:text-slate-400">
          No products in this category yet.
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} {...product} priority={index < 4} />
          ))}
        </section>
      )}
    </section>
  );
}
