"use client";

import CartItem from "@/components/CartItem";
import { useCartStore } from "@/store/useCartStore";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
	interface Window {
		Razorpay: new (options: RazorpayOptions) => { open: () => void };
	}
}

type RazorpayOptions = {
	key: string;
	amount: number;
	currency: string;
	name: string;
	description: string;
	order_id: string;
	handler: (response: { razorpay_payment_id: string; razorpay_order_id: string }) => void;
	prefill?: { name?: string; email?: string; contact?: string };
	theme?: { color?: string };
};

function loadRazorpayScript(): Promise<boolean> {
	return new Promise((resolve) => {
		if (typeof window === "undefined") return resolve(false);
		if (window.Razorpay) return resolve(true);

		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onload = () => resolve(true);
		script.onerror = () => resolve(false);
		document.body.appendChild(script);
	});
}

export default function CartPage() {
	const cartItems = useCartStore((state) => state.cartItems);
	const total = useMemo(
		() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
		[cartItems]
	);
	const [isCheckingOut, setIsCheckingOut] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleCheckout = async () => {
		setError(null);
		if (cartItems.length === 0 || total <= 0) return;

		setIsCheckingOut(true);
		const scriptLoaded = await loadRazorpayScript();
		if (!scriptLoaded) {
			setError("Failed to load Razorpay checkout.");
			setIsCheckingOut(false);
			return;
		}

		try {
			const checkoutResponse = await fetch("/api/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					items: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
					totalAmount: total,
				}),
			});

			if (!checkoutResponse.ok) {
				const errorBody = (await checkoutResponse.json()) as { error?: string };
				throw new Error(errorBody.error ?? "Checkout initialization failed.");
			}

			const checkoutData = (await checkoutResponse.json()) as {
				order_id: string;
				amount: number;
				currency: string;
			};

			const options: RazorpayOptions = {
				key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
				amount: checkoutData.amount,
				currency: checkoutData.currency,
				name: "ShopFusion",
				description: "Order payment",
				order_id: checkoutData.order_id,
				handler: async () => {
					await fetch("/api/orders", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							userId: "guest",
							totalAmount: total,
							items: cartItems.map((item) => ({
								productId: item.id,
								quantity: item.quantity,
							})),
						}),
					});

					router.push("/success");
				},
				theme: { color: "#6d28d9" },
			};

			if (!options.key) {
				setError("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID.");
				setIsCheckingOut(false);
				return;
			}

			const razorpay = new window.Razorpay(options);
			razorpay.open();
		} catch (checkoutError) {
			const message =
				checkoutError instanceof Error
					? checkoutError.message
					: "Unable to start checkout.";
			setError(message);
		} finally {
			setIsCheckingOut(false);
		}
	};

	return (
		<main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
				<header className="space-y-2">
					<h1 className="text-3xl font-semibold text-slate-900">Your cart</h1>
					<p className="text-sm text-slate-500">
						Review your items and proceed to checkout.
					</p>
				</header>

				{cartItems.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
						Your cart is empty. Start adding products.
					</div>
				) : (
					<div className="space-y-6">
						<section className="space-y-4">
							{cartItems.map((item) => (
								<CartItem key={item.id} item={item} />
							))}
						</section>

						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between text-lg font-semibold text-slate-900">
								<span>Total</span>
								<span>${total.toFixed(2)}</span>
							</div>
							{error ? (
								<p className="text-sm text-rose-600">{error}</p>
							) : null}
							<button
								type="button"
								onClick={handleCheckout}
								disabled={isCheckingOut}
								className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
							>
								{isCheckingOut ? "Processing..." : "Checkout"}
							</button>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
