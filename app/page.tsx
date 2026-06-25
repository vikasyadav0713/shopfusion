import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import { prisma } from "@/lib/prisma";
import { getProductImage } from "@/lib/getProductImage";

type PageProps = {
	searchParams?: { q?: string; category?: string; sort?: string };
};

export default async function HomePage({ searchParams }: PageProps) {
	const query = searchParams?.q?.trim();
	const searchQuery = query ? query.toLowerCase() : undefined;
	const allCategories = ["All", "Electronics", "Fashion", "Home"];
	const requestedCategory = searchParams?.category?.trim();
	const activeCategory = allCategories.includes(requestedCategory ?? "")
		? (requestedCategory as string)
		: "All";
	const sort = searchParams?.sort === "price_asc"
		? "price_asc"
		: searchParams?.sort === "price_desc"
			? "price_desc"
			: "newest";

	const whereClause = {
		...(searchQuery
			? {
				name: {
					contains: searchQuery,
					mode: "insensitive",
				},
			}
			: {}),
		...(activeCategory !== "All" ? { category: activeCategory } : {}),
	};

	const orderByClause =
		sort === "price_asc"
			? { price: "asc" as const }
			: sort === "price_desc"
				? { price: "desc" as const }
				: { createdAt: "desc" as const };
	const rawProducts = await prisma.product.findMany({
		select: {
			id: true,
			name: true,
			price: true,
			image: true,
			category: true,
		},
		where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
		orderBy: orderByClause,
	});

	// Resolve each product's image to the local file in public/products/
	const products = rawProducts.map((p) => ({
		...p,
		image: getProductImage(p.name),
	}));

	const categoriesForGallery = [activeCategory];

	const buildCategoryUrl = (category: string) => {
		const params = new URLSearchParams();
		if (searchQuery) params.set("q", searchQuery);
		if (category !== "All") params.set("category", category);
		if (sort !== "newest") params.set("sort", sort);
		const queryString = params.toString();
		return queryString ? `/?${queryString}` : "/";
	};

	return (
		<main className="px-4 pb-20 pt-10 sm:px-8">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
				<section className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 p-8 shadow-[0_22px_60px_rgba(15,23,42,0.12)] sm:p-12">
					<div className="absolute -right-24 top-6 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />
					<div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-cyan-400/25 blur-3xl" />
					<div className="relative space-y-6">
						<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
							ShopFusion curated
						</p>
						<h1 className="text-3xl font-semibold text-slate-900 sm:text-5xl">
							ShopFusion: Where Shopping Meets Innovation
						</h1>
						<p className="max-w-2xl text-base text-slate-600">
							Discover modern, curated essentials with a bold, tech-forward experience
							built for fast, confident shopping.
						</p>
					</div>
				</section>
				<section className="space-y-6 rounded-2xl border border-white/30 bg-white/70 p-6 shadow-sm backdrop-blur-md sm:p-8">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
							Latest products
						</h2>
						<div className="flex items-center gap-3 text-sm text-slate-500">
							{searchQuery ? (
								<span>Search: “{searchQuery}”</span>
							) : null}
							<span>Sort</span>
							<form method="get">
								{searchQuery ? (
									<input type="hidden" name="q" value={searchQuery} />
								) : null}
								{activeCategory !== "All" ? (
									<input type="hidden" name="category" value={activeCategory} />
								) : null}
								<select
									name="sort"
									defaultValue={sort}
									className="rounded-lg border border-slate-200/80 bg-white/85 px-2 py-1 text-sm text-slate-700 shadow-[0_10px_22px_rgba(15,23,42,0.08)]"
								>
									<option value="newest">Newest</option>
									<option value="price_asc">Price: Low to High</option>
									<option value="price_desc">Price: High to Low</option>
								</select>
							</form>
						</div>
					</div>

					<div className="flex flex-wrap gap-3">
						{allCategories.map((category) => (
							<Link
								key={category}
								href={buildCategoryUrl(category)}
								className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition duration-300 ${
									activeCategory === category
										? "border-slate-900 bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.2)]"
										: "border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300 hover:text-slate-800"
								}`}
							>
								{category}
							</Link>
						))}
					</div>

					<ProductGallery products={products} categories={categoriesForGallery} />
				</section>
			</div>
		</main>
	);
}
