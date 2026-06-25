"use client";

import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  
  const { items, isLoading, isInitialized, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleMoveToCart = async (item: any) => {
    try {
      // 1. Add to Cart
      addToCart({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
      });
      
      // 2. Remove from Wishlist
      await removeFromWishlist(item.product.id);
      
      toast.success("Moved to cart!");
    } catch (error) {
      toast.error("Failed to move item to cart");
    }
  };

  if (!isLoaded || !isInitialized || isLoading) {
    return (
      <main className="min-h-screen px-4 pb-20 pt-10 sm:px-8 bg-slate-50 dark:bg-transparent transition-colors duration-300">
        <div className="mx-auto w-full max-w-6xl">
          <div className="h-10 w-48 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800 mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pb-20 pt-10 sm:px-8 bg-slate-50 dark:bg-transparent transition-colors duration-300">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">My Wishlist</h1>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-600">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 py-24 text-center backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white/70 dark:hover:bg-slate-800/70">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-50 dark:from-rose-900/20 to-pink-100 dark:to-pink-900/20 text-rose-500 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Your wishlist is empty</h2>
            <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400 text-center transition-colors">
              Looks like you haven't saved any items yet. Explore our collections and find something you love!
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(124,58,237,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(124,58,237,0.55)]"
            >
              Continue Shopping
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <div key={item.id} className="group relative flex flex-col">
                <ProductCard
                  id={item.product.id}
                  name={item.product.name}
                  price={item.product.price}
                  image={item.product.image}
                  category={item.product.category}
                />
                
                {/* Overlay Action: Move to Cart */}
                <div className="absolute inset-x-0 bottom-0 z-20 translate-y-4 opacity-0 transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-100 flex justify-center px-4">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-slate-900 dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-slate-900 shadow-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M6 6h15l-1.5 9h-12z" />
                      <path d="M6 6l-2-3" />
                      <circle cx="9" cy="20" r="1.5" />
                      <circle cx="18" cy="20" r="1.5" />
                    </svg>
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
