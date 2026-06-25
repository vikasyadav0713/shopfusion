"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import RatingStars from "@/components/RatingStars";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type QuickViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
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

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...product, quantity: 1 });
    }
    toast.success("Added to cart");
    onClose();
    // TODO: Open cart drawer
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row max-h-[90vh]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-1/2 bg-slate-100 dark:bg-slate-800 relative h-64 md:h-auto min-h-[300px]">
                <ProductImage
                  name={product.name}
                  src={product.image}
                  alt={product.name}
                  category={product.category}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Details Section */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto custom-scrollbar">
                <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
                  {product.category}
                </p>
                <h2 id="modal-title" className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  {product.name}
                </h2>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.reviewCount > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full">
                      <RatingStars rating={product.averageRating} size={14} />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        ({product.reviewCount})
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                  Experience premium quality and design. This product is engineered for maximum performance and durability, ensuring you get the best value for your investment.
                </p>

                <div className="mt-auto space-y-6">
                  {/* Quantity */}
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">Quantity</span>
                    <div className="flex items-center w-32 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-medium text-slate-900 dark:text-white">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg shadow-slate-900/20"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-semibold rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors border border-violet-100 dark:border-violet-800">
                      <Heart className="w-5 h-5" />
                      Save
                    </button>
                  </div>
                  <a
                    href={`/products/${product.id}`}
                    className="block text-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors underline underline-offset-4"
                  >
                    View full details
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
