"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useCartStore } from "@/store/useCartStore";

export default function Navbar() {
	const cartCount = useCartStore((state) =>
		state.cartItems.reduce((total, item) => total + item.quantity, 0)
	);
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
		<header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/70 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
				<Link href="/" className="group flex items-center gap-3">
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.35)] transition group-hover:scale-[1.03]">
						SF
					</span>
					<div>
						<p className="text-sm font-semibold text-slate-900">ShopFusion</p>
						<p className="text-xs text-slate-500">Where Shopping Meets Innovation</p>
					</div>
				</Link>

				<form
					onSubmit={handleSearch}
					className="order-3 flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-2 text-sm text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition duration-300 focus-within:border-violet-200 focus-within:shadow-[0_14px_34px_rgba(79,70,229,0.24)] sm:order-none sm:max-w-xs"
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

				<nav className="flex flex-1 items-center justify-end gap-3">
					<Link
						href="/cart"
						className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.1)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_32px_rgba(15,23,42,0.16)]"
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
							<span className="ml-1 rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
								{cartCount}
							</span>
						) : null}
					</Link>

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
