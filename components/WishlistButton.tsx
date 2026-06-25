"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";
import { useState } from "react";

type WishlistButtonProps = {
  productId: number;
  className?: string;
};

export default function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { hasProduct, addToWishlist, removeFromWishlist } = useWishlistStore();
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // Derive if the product is wishlisted from the global store
  const isWishlisted = hasProduct(productId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to add to wishlist");
      router.push("/sign-in");
      return;
    }

    setIsLocalLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    } finally {
      setIsLocalLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLocalLoading}
      className={`group flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 shadow-[0_4px_14px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-95 disabled:opacity-70 ${
        isWishlisted ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
      } ${className}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isWishlisted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-5 w-5 transition-transform duration-300 ${
          isWishlisted ? "scale-110" : ""
        } ${isLocalLoading ? "animate-pulse" : ""}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
