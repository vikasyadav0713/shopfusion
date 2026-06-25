"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import { useAuth } from "@clerk/nextjs";
import { getProductImage } from "@/lib/getProductImage";

type TrackerProps = {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    averageRating: number;
    reviewCount: number;
  };
};

export default function RecentlyViewedTracker({ product }: TrackerProps) {
  const addProduct = useRecentlyViewedStore((state) => state.addProduct);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // Add to local storage
    addProduct({
      ...product,
      image: getProductImage(product.name), // Ensure we have the resolved client image
    });

    // If logged in, sync with DB
    if (isSignedIn) {
      fetch("/api/recently-viewed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      }).catch(console.error);
    }
  }, [product, addProduct, isSignedIn]);

  return null; // This component has no UI
}
