"use client";

import { useEffect, useState } from "react";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import { useAuth } from "@clerk/nextjs";
import ProductCard from "@/components/ProductCard";

export default function RecentlyViewed() {
  const { items, syncWithDb } = useRecentlyViewedStore();
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Fetch from DB if signed in
    if (isSignedIn) {
      fetch("/api/recently-viewed")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            syncWithDb(data);
          }
        })
        .catch(console.error);
    }
  }, [isSignedIn, syncWithDb]);

  if (!mounted || items.length === 0) return null;

  return (
    <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recently Viewed</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            {...item}
          />
        ))}
      </div>
    </section>
  );
}
