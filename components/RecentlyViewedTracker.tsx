"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import { useAuth } from "@clerk/nextjs";
import { getProductImageCandidates } from "@/lib/getProductImageClient";

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
      image: getProductImageCandidates(product.name)[0] || product.image,
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
