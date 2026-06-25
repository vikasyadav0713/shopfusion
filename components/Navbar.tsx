"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useEffect } from "react";

export default function Navbar() {
	const { cartItems, openDrawer } = useCartStore();
	const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

	const { items: wishlistItems, fetchWishlist, isInitialized } = useWishlistStore();
	const wishlistCount = wishlistItems.length;
	const { isSignedIn } = useAuth();

	useEffect(() => {
		if (isSignedIn && !isInitialized) {
			fetchWishlist();
		}
	}, [isSignedIn, isInitialized, fetchWishlist]);

	const router = useRouter();
	const searchParams = useSearchParams();
	const query = useMemo(() => searchParams.get("q") ?? "", [searchParams]);

	const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const rawQuery = String(formData.get("q") ?? "").trim();
		const params = new URLSearchParams(searchParams.toString());

		if (rawQuery) {
			params.set("q", rawQuery);
		} else {
			params.delete("q");
		}

		router.push(params.toString() ? `/?${params.toString()}` : "/");
	};

	return (
		<header className="sticky top-0 z-50 w-full overflow-visible border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/60 dark:shadow-slate-900/60 transition-colors duration-300">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-3 overflow-visible px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
				<Link href="/" className="group flex items-center gap-3">
					<div className="relative h-12 w-12 transition group-hover:scale-[1.03]">
						<Image
							src="/logo.png"
							alt="ShopFusion Logo"
							fill
							sizes="48px"
							className="object-contain"
						/>
					</div>
					<div>
						<p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">ShopFusion</p>
						<p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Where Shopping Meets Innovation</p>
					</div>
				</Link>

				<form
					onSubmit={handleSearch}
					className="order-3 flex w-full items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-800/85 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition duration-300 focus-within:border-violet-200 dark:focus-within:border-violet-500 focus-within:shadow-[0_14px_34px_rgba(79,70,229,0.24)] sm:order-none sm:max-w-xs"
				>
					<svg
						aria-hidden
						viewBox="0 0 24 24"
						className="h-4 w-4 text-slate-400"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
					>
						<circle cx="11" cy="11" r="7" />
						<path d="M20 20l-3.5-3.5" />
					</svg>
					<input
						name="q"
						defaultValue={query}
						placeholder="Search products"
						title="Search products"
						className="w-full bg-transparent text-sm text-slate-700 outline-none"
					/>
				</form>

				<nav className="flex flex-1 items-center justify-end gap-3 overflow-visible">
					<ThemeToggle />
					<Link
						href="/wishlist"
						className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-800/85 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-[0_16px_32px_rgba(15,23,42,0.16)] dark:hover:shadow-[0_16px_32px_rgba(0,0,0,0.5)]"
						aria-label="Wishlist"
					>
						<svg
							aria-hidden
							viewBox="0 0 24 24"
							className={`h-5 w-5 transition-colors ${wishlistCount > 0 ? "text-rose-500 fill-rose-500" : "text-slate-700 dark:text-slate-300"}`}
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
						</svg>
						<span className="hidden sm:inline">Saved</span>
						{wishlistCount > 0 && (
							<span className="ml-1 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
								{wishlistCount}
							</span>
						)}
					</Link>

					<button
						onClick={openDrawer}
						className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-800/85 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-[0_10px_24px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-[0_16px_32px_rgba(15,23,42,0.16)] dark:hover:shadow-[0_16px_32px_rgba(0,0,0,0.5)]"
					>
						<svg
							aria-hidden
							viewBox="0 0 24 24"
							className="h-5 w-5"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
						>
							<path d="M6 6h15l-1.5 9h-12z" />
							<path d="M6 6l-2-3" />
							<circle cx="9" cy="20" r="1.5" />
							<circle cx="18" cy="20" r="1.5" />
						</svg>
						<span>Cart</span>
						{cartCount > 0 ? (
							<span className="ml-1 rounded-full bg-slate-900 dark:bg-white px-2 py-0.5 text-xs font-semibold text-white dark:text-slate-900 transition-colors">
								{cartCount}
							</span>
						) : null}
					</button>

					<SignedOut>
						<SignInButton>
							<button
								type="button"
								className="rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(124,58,237,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(124,58,237,0.55)]"
							>
								Sign in
							</button>
						</SignInButton>
					</SignedOut>
					<SignedIn>
						<UserButton afterSignOutUrl="/" />
					</SignedIn>
				</nav>
			</div>
		</header>
	);
}
