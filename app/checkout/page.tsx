"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, ShieldCheck, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
	const cartItems = useCartStore((state) => state.cartItems);
	const clearCart = useCartStore((state) => state.clearCart);
	const router = useRouter();
	const [isProcessing, setIsProcessing] = useState(false);

	const totalAmount = (cartItems || []).reduce((acc, item) => acc + item.price * item.quantity, 0);

	const handleCheckout = async () => {
		setIsProcessing(true);
		
		try {
			// Simulate a dummy test API call for order creation
			const response = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: "guest",
					totalAmount: totalAmount,
					items: cartItems.map((item) => ({
						productId: item.id,
						quantity: item.quantity,
						price: item.price,
					})),
				}),
			});

			if (!response.ok) {
				const errBody = await response.json().catch(() => ({}));
				throw new Error(errBody.error || "Failed to create order");
			}

			// Simulate processing delay for realistic feeling
			await new Promise((resolve) => setTimeout(resolve, 1500));
			
			clearCart();
			router.push("/success");
		} catch (error: any) {
			console.error("Checkout error:", error);
			alert(`Failed to process checkout: ${error?.message || "Please try again."}`);
			setIsProcessing(false);
		}
	};

	if (!cartItems || cartItems.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#F1F5F9] dark:bg-[#0B1121] transition-colors duration-300">
				<div className="text-center space-y-6">
					<h2 className="text-3xl font-bold text-slate-900 dark:text-white">Your cart is empty</h2>
					<p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet.</p>
					<Link 
						href="/"
						className="inline-block px-8 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/25"
					>
						Go Shopping
					</Link>
				</div>
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1121] py-12 px-4 sm:px-6 transition-colors duration-300">
			<div className="max-w-3xl mx-auto space-y-8">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Checkout</h1>
					<p className="text-slate-500 dark:text-slate-400 transition-colors">Complete your secure order</p>
				</div>

				<div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors duration-300">
					<div className="space-y-8">
						<div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
							<span className="text-lg font-medium text-slate-600 dark:text-slate-400 transition-colors">Total Amount to Pay</span>
							<span className="text-4xl font-black text-violet-600 dark:text-violet-400 transition-colors">₹{totalAmount.toFixed(2)}</span>
						</div>

						<div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4 transition-colors">
							<div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-bold text-lg">
								<ShieldCheck className="w-6 h-6 text-emerald-500" />
								<span>Secure Checkout</span>
							</div>
							<p className="text-slate-600 dark:text-slate-400 leading-relaxed">
								Your order will be processed securely. By placing this order, you agree to our Terms of Service and Privacy Policy.
							</p>
						</div>

						<button
							onClick={handleCheckout}
							disabled={isProcessing}
							className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-violet-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-lg"
						>
							{isProcessing ? (
								<>
									<Loader2 className="w-6 h-6 animate-spin" />
									Processing Order...
								</>
							) : (
								<>
									<CreditCard className="w-6 h-6" />
									Complete Purchase
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
