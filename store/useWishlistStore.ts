import { create } from "zustand";
import axios from "axios";

export type WishlistItem = {
  id: number;
  userId: string;
  productId: number;
  createdAt: string;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    stock: number;
  };
};

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  isInitialized: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  hasProduct: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  isLoading: false,
  isInitialized: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/api/wishlist");
      set({ items: response.data, isInitialized: true });
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      // Optional: handle auth errors by leaving items empty
    } finally {
      set({ isLoading: false });
    }
  },

  addToWishlist: async (productId: number) => {
    try {
      const response = await axios.post("/api/wishlist", { productId });
      set((state) => ({
        items: [response.data, ...state.items],
      }));
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      throw error;
    }
  },

  removeFromWishlist: async (productId: number) => {
    try {
      await axios.delete(`/api/wishlist/${productId}`);
      set((state) => ({
        items: state.items.filter((item) => item.productId !== productId),
      }));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      throw error;
    }
  },

  hasProduct: (productId: number) => {
    return get().items.some((item) => item.productId === productId);
  },
}));
