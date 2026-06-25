"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewedProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  averageRating: number;
  reviewCount: number;
  viewedAt: number;
};

type RecentlyViewedState = {
  items: ViewedProduct[];
  addProduct: (product: Omit<ViewedProduct, "viewedAt">) => void;
  syncWithDb: (dbItems: ViewedProduct[]) => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      addProduct: (product) => {
        const currentItems = get().items;
        // Remove if it already exists to avoid duplicates
        const filtered = currentItems.filter((item) => item.id !== product.id);
        
        // Add to beginning with current timestamp
        const newItems = [
          { ...product, viewedAt: Date.now() },
          ...filtered,
        ].slice(0, 12); // Keep only max 12

        set({ items: newItems });
      },
      syncWithDb: (dbItems) => {
        // Merge local storage items with DB items, preferring most recent
        const allItems = [...get().items, ...dbItems];
        
        // Deduplicate by ID, keeping the one with the most recent viewedAt
        const deduplicated = Array.from(
          allItems.reduce((map, item) => {
            const existing = map.get(item.id);
            if (!existing || existing.viewedAt < item.viewedAt) {
              map.set(item.id, item);
            }
            return map;
          }, new Map<number, ViewedProduct>()).values()
        );

        // Sort by viewedAt descending and take top 12
        const sorted = deduplicated
          .sort((a, b) => b.viewedAt - a.viewedAt)
          .slice(0, 12);

        set({ items: sorted });
      },
    }),
    {
      name: "shopfusion-recently-viewed",
    }
  )
);
