import LandingClient from "@/components/LandingClient";
import { prisma, prismaWithRetry } from "@/lib/prisma";
import { getProductImage } from "@/lib/getProductImage";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/filters/FilterSidebar";
import MobileFilterDrawer from "@/components/filters/MobileFilterDrawer";
import ActiveFilterChips from "@/components/filters/ActiveFilterChips";
import Pagination from "@/components/filters/Pagination";
import SortSelect from "@/components/filters/SortSelect";

// Always fetch fresh data — never serve a stale cached build
export const dynamic = "force-dynamic";

type PageProps = {
	searchParams?: {
		q?: string;
		category?: string;
		sort?: string;
		brands?: string;
		categories?: string;
		min?: string;
		max?: string;
		rating?: string;
		discount?: string;
		stock?: string;
		page?: string;
	};
};

export default async function HomePage({ searchParams }: PageProps) {
	// --- Parse Search Params ---
	const query = searchParams?.q?.trim();
	const searchQuery = query ? query.toLowerCase() : undefined;

	const sort = searchParams?.sort || "newest";
	const page = Number(searchParams?.page) || 1;
	const limit = 12;
	const skip = (page - 1) * limit;

	// Build Prisma Where Clause
	const whereClause: any = {
		...(searchQuery && { name: { contains: searchQuery, mode: "insensitive" } }),
	};

	if (searchParams?.brands) {
		whereClause.brand = { in: searchParams.brands.split(",") };
	}

	if (searchParams?.categories) {
		whereClause.category = { in: searchParams.categories.split(",") };
	} else if (searchParams?.category && searchParams?.category !== "All") {
		whereClause.category = searchParams.category;
	}

	if (searchParams?.min || searchParams?.max) {
		whereClause.price = {};
		if (searchParams.min) whereClause.price.gte = Number(searchParams.min);
		if (searchParams.max) whereClause.price.lte = Number(searchParams.max);
	}

	if (searchParams?.rating) {
		whereClause.averageRating = { gte: Number(searchParams.rating) };
	}

	if (searchParams?.discount) {
		whereClause.discount = { gte: Number(searchParams.discount) };
	}

	if (searchParams?.stock) {
		if (searchParams.stock === "in_stock") whereClause.stock = { gt: 0 };
		if (searchParams.stock === "out_of_stock") whereClause.stock = { equals: 0 };
	}

	// Build OrderBy Clause
	let orderByClause: any = { createdAt: "desc" };
	switch (sort) {
		case "price-asc": orderByClause = { price: "asc" }; break;
		case "price-desc": orderByClause = { price: "desc" }; break;
		case "rating": orderByClause = { averageRating: "desc" }; break;
		case "popular": orderByClause = { reviewCount: "desc" }; break;
		case "name-asc": orderByClause = { name: "asc" }; break;
		case "name-desc": orderByClause = { name: "desc" }; break;
		case "discount": orderByClause = { discount: "desc" }; break;
	}

	// --- Fetch ALL data in a single parallel batch ---
	let rawFeaturedProducts: any[] = [];
	let rawProducts: any[] = [];
	let totalCount = 0;
	let brandAgg: any[] = [];
	let categoryAgg: any[] = [];
	let priceAgg: any = { _max: { price: null } };

	try {
		const facetWhere = { ...whereClause };
		delete facetWhere.brand;
		delete facetWhere.category;
		const facetWhereArg = Object.keys(facetWhere).length > 0 ? facetWhere : undefined;

		const [
			fetchedFeatured,
			fetchedProducts,
			fetchedTotalCount,
			fetchedBrandAgg,
			fetchedCategoryAgg,
			fetchedPriceAgg
		] = await prismaWithRetry(() => Promise.all([
			prisma.product.findMany({
				take: 4,
				orderBy: { reviewCount: "desc" },
				select: { id: true, name: true, price: true, category: true }
			}),
			prisma.product.findMany({
				select: { id: true, name: true, price: true, image: true, category: true, averageRating: true, reviewCount: true },
				where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
				orderBy: orderByClause,
				skip,
				take: limit,
			}),
			prisma.product.count({
				where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
			}),
			prisma.product.groupBy({
				by: ['brand'],
				_count: { brand: true },
				where: facetWhereArg,
			}),
			prisma.product.groupBy({
				by: ['category'],
				_count: { category: true },
				where: facetWhereArg,
			}),
			prisma.product.aggregate({
				_max: { price: true },
				where: facetWhereArg,
			})
		]));

		rawFeaturedProducts = fetchedFeatured;
		rawProducts = fetchedProducts;
		totalCount = fetchedTotalCount;
		brandAgg = fetchedBrandAgg;
		categoryAgg = fetchedCategoryAgg;
		priceAgg = fetchedPriceAgg;
	} catch (error) {
		console.error("Database query failed after retries:", error);
	}

	const featuredProducts = rawFeaturedProducts.map((p) => ({
		...p,
		image: getProductImage(p.name)
	}));

	const products = rawProducts.map((p) => ({ ...p, image: getProductImage(p.name) }));
	const totalPages = Math.ceil(totalCount / limit);

	const filterBrands = brandAgg.map(b => ({ brand: b.brand, count: b._count.brand })).sort((a, b) => b.count - a.count);
	const filterCategories = categoryAgg.map(c => ({ category: c.category, count: c._count.category })).sort((a, b) => b.count - a.count);
	const maxPrice = priceAgg._max?.price || 10000;

	return (
		<div className="flex flex-col min-h-screen">
			{/* Landing Page Content */}
			<LandingClient featuredProducts={featuredProducts} />

			{/* Shop Content */}
			<section id="shop" className="px-4 pb-24 pt-8 sm:px-8 bg-[#F1F5F9] dark:bg-[#0B1121] transition-colors duration-300">
				<div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10">
					{/* Top Hero Section */}
					<div className="relative overflow-hidden rounded-[32px] border border-white bg-gradient-to-br from-indigo-900 via-violet-800 to-fuchsia-900 p-8 shadow-xl sm:p-12 text-white">
						<div className="absolute -right-24 top-6 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
						<div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
						<div className="relative space-y-4">
							<h1 className="text-3xl font-bold sm:text-5xl tracking-tight">ShopFusion Essentials</h1>
							<p className="max-w-xl text-indigo-100 text-lg">
								Discover curated tech and lifestyle products built for the modern professional.
							</p>
						</div>
					</div>

					{/* Main Content Layout */}
					<div className="flex flex-col lg:flex-row gap-8 items-stretch">
						{/* Desktop Filter Sidebar */}
						<div className="w-full lg:w-72 shrink-0 flex flex-col">
							<FilterSidebar
								brands={filterBrands}
								categories={filterCategories}
								maxPrice={Math.ceil(maxPrice)}
							/>
						</div>

						{/* Product Grid Area */}
						<div className="flex-1 w-full min-w-0">
							{/* Grid Header (Sort & Mobile Filter) */}
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 transition-colors duration-300">
								<div className="flex items-center gap-4">
									<MobileFilterDrawer
										brands={filterBrands}
										categories={filterCategories}
										maxPrice={Math.ceil(maxPrice)}
									/>
									<span className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">
										Showing <span className="text-slate-900 dark:text-white">{products.length ? skip + 1 : 0}-{Math.min(skip + limit, totalCount)}</span> of <span className="text-slate-900 dark:text-white">{totalCount}</span> products
										{searchQuery && <span> for <span className="text-slate-900 dark:text-white font-semibold">"{searchQuery}"</span></span>}
									</span>
								</div>

								<div className="flex items-center gap-3">
									<form method="get" className="flex items-center gap-2">
										{/* Pass along other params to preserve them */}
										{Object.entries(searchParams || {}).map(([key, val]) => {
											if (key !== 'sort' && typeof val === 'string') {
												return <input key={key} type="hidden" name={key} value={val} />;
											}
											return null;
										})}
										<label htmlFor="sort" className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">Sort by:</label>
										<SortSelect defaultValue={sort} />
									</form>
								</div>
							</div>

							<ActiveFilterChips />

							{products.length > 0 ? (
								<>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
										{products.map((product, index) => (
											<ProductCard key={product.id} {...product} priority={index < 4} />
										))}
									</div>
									<Pagination currentPage={page} totalPages={totalPages} />
								</>
							) : (
								<div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 transition-colors duration-300">
									<svg className="w-20 h-20 text-slate-200 dark:text-slate-600 mb-6 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
									<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">No products found</h3>
									<p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md text-center transition-colors">
										We couldn't find anything matching your current filters. Try adjusting your search or clearing some filters.
									</p>
									<Link
										href="/"
										className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition shadow-sm"
									>
										Clear All Filters
									</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
