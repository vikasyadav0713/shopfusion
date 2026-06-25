"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { useMemo, useEffect, useState, useTransition, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

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
	const searchParams = useSearchParams()!;
	const query = useMemo(() => searchParams.get("q") ?? "", [searchParams]);

	const [localQuery, setLocalQuery] = useState(query);
	const [isPending, startTransition] = useTransition();
	const debounceTimer = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		setLocalQuery(query);
	}, [query]);

	const handleSearch = (event?: React.FormEvent<HTMLFormElement>, searchString?: string) => {
		if (event) event.preventDefault();
		const rawQuery = (searchString ?? localQuery).trim();
		const params = new URLSearchParams(searchParams.toString());

		if (rawQuery) {
			params.set("q", rawQuery);
		} else {
			params.delete("q");
		}

		const newUrl = params.toString() ? `/?${params.toString()}#shop` : "/#shop";

		startTransition(() => {
			router.push(newUrl, { scroll: true });
			if (window.location.pathname === "/") {
				setTimeout(() => {
					document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
				}, 50);
			}
		});
	};

	const handleLiveSearch = (value: string) => {
		setLocalQuery(value);
		if (debounceTimer.current) clearTimeout(debounceTimer.current);

		debounceTimer.current = setTimeout(() => {
			handleSearch(undefined, value);
		}, 400);
	};

	return (
		<header className="sticky top-0 z-50 w-full overflow-visible border-b border-white/40 dark:border-white/5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 transition-colors duration-300">
			<div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 overflow-visible px-4 py-4 sm:py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8">
				<Link href="/" className="group flex items-center gap-4 shrink-0">
					<div className="relative h-14 w-14 sm:h-16 sm:w-16 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
						<Image
							src="/logo.png"
							alt="ShopFusion Logo"
							fill
							sizes="64px"
							className="object-contain drop-shadow-lg"
						/>
					</div>
					<div className="flex flex-col justify-center">
						<p className="text-2xl sm:text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 transition-all duration-300 group-hover:brightness-125">ShopFusion</p>
						<p className="text-[11px] sm:text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 transition-colors">Where Shopping Meets Innovation</p>
					</div>
				</Link>

				<form
					onSubmit={handleSearch}
					className="order-3 flex w-full flex-1 max-w-xl mx-auto items-center gap-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 pl-5 pr-2 py-2 shadow-md transition-all duration-300 focus-within:border-violet-400 dark:focus-within:border-violet-500 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.2)] focus-within:bg-white dark:focus-within:bg-slate-800 sm:order-none relative"
				>
					{isPending ? (
						<svg className="h-5 w-5 text-violet-500 animate-spin" viewBox="0 0 24 24" fill="none">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					) : (
						<svg
							aria-hidden
							viewBox="0 0 24 24"
							className="h-5 w-5 text-violet-500"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
						>
							<circle cx="11" cy="11" r="7" />
							<path d="M20 20l-3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					)}
					<input
						name="q"
						value={localQuery}
						onChange={(e) => handleLiveSearch(e.target.value)}
						placeholder="Search for anything..."
						title="Search products"
						className="w-full bg-transparent text-base font-medium text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
					/>
					<button
						type="submit"
						className="hidden sm:flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-5 py-2 text-sm font-bold tracking-wide text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25 active:scale-95"
					>
						Search
					</button>
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
