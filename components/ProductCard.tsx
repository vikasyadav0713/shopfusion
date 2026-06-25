"use client";

import ProductImage from "@/components/ProductImage";

type ProductCardProps = {
	id: number;
	name: string;
	price: number;
	image: string;
	category?: string;
	priority?: boolean;
};

export default function ProductCard({
	id,
	name,
	price,
	image,
	category = "Essentials",
	priority = false,
}: ProductCardProps) {
	return (
		<article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition duration-300 hover:-translate-y-[5px] hover:shadow-xl">
			<div className="relative h-[210px] w-full overflow-hidden rounded-t-2xl bg-slate-100">
				<ProductImage
					name={name}
					src={image}
					alt={name}
					category={category}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
					className="rounded-t-2xl object-cover transition duration-300 group-hover:scale-105"
					priority={priority}
				/>
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
			</div>
			<div className="flex flex-1 flex-col gap-4 p-5">
				<div className="space-y-1">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
						{category}
					</p>
					<h3 className="line-clamp-2 text-lg font-semibold text-slate-900">{name}</h3>
					<p className="text-lg font-semibold text-slate-900">${price.toFixed(2)}</p>
				</div>
				<a
					href={`/products/${id}`}
					className="mt-auto inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(124,58,237,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(124,58,237,0.55)]"
				>
					View Details
				</a>
			</div>
		</article>
	);
}
