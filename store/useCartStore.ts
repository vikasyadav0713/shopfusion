"use client";

import { create } from "zustand";

export type CartItem = {
	id: number;
	name: string;
	price: number;
	image: string;
	quantity: number;
};

type CartState = {
	cartItems: CartItem[];
	addToCart: (product: Omit<CartItem, "quantity">) => void;
	removeFromCart: (id: number) => void;
	increaseQuantity: (id: number) => void;
	decreaseQuantity: (id: number) => void;
};

export const useCartStore = create<CartState>((set, get) => ({
	cartItems: [],
	addToCart: (product) => {
		const existing = get().cartItems.find((item) => item.id === product.id);

		if (existing) {
			set({
				cartItems: get().cartItems.map((item) =>
					item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
				),
			});
			return;
		}

		set({ cartItems: [...get().cartItems, { ...product, quantity: 1 }] });
	},
	removeFromCart: (id) => {
		set({ cartItems: get().cartItems.filter((item) => item.id !== id) });
	},
	increaseQuantity: (id) => {
		set({
			cartItems: get().cartItems.map((item) =>
				item.id === id ? { ...item, quantity: item.quantity + 1 } : item
			),
		});
	},
	decreaseQuantity: (id) => {
		const current = get().cartItems.find((item) => item.id === id);

		if (!current) return;
		if (current.quantity === 1) {
			set({ cartItems: get().cartItems.filter((item) => item.id !== id) });
			return;
		}

		set({
			cartItems: get().cartItems.map((item) =>
				item.id === id ? { ...item, quantity: item.quantity - 1 } : item
			),
		});
	},
}));
