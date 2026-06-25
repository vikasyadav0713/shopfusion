"use client";

import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { cartItems, isDrawerOpen, closeDrawer, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!mounted) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[101] h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 id="cart-title" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Your Cart
                <span className="text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full ml-2">
                  {cartItems.length}
                </span>
              </h2>
              <button
                onClick={closeDrawer}
                className="p-2 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">Your cart is empty</p>
                  <p className="text-slate-500 dark:text-slate-400 max-w-[250px]">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                  <button
                    onClick={closeDrawer}
                    className="mt-4 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {cartItems.map((item) => (
                    <motion.li
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id}
                      className="flex gap-4"
                    >
                      <div className="relative w-20 h-20 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-violet-600 dark:text-violet-400 font-semibold text-sm mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-auto pt-2">
                          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-slate-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 text-center">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-[0_8px_20px_rgba(124,58,237,0.3)] hover:-translate-y-0.5"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold py-3.5 px-6 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    View Full Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
