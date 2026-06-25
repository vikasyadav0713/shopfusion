"use client";

import ProductImage from "@/components/ProductImage";
import WishlistButton from "@/components/WishlistButton";
import RatingStars from "@/components/RatingStars";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import QuickViewModal from "@/components/QuickViewModal";

type ProductCardProps = {
	id: number;
	name: string;
	price: number;
	image: string;
	category?: string;
	priority?: boolean;
	averageRating?: number;
	reviewCount?: number;
};

export default function ProductCard({
	id,
	name,
	price,
	image,
	category = "Essentials",
	priority = false,
	averageRating = 0,
	reviewCount = 0,
}: ProductCardProps) {
	const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

	return (
		<>
			<motion.article
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-50px" }}
				transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
				className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-[5px] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
			>
				<div className="relative h-[210px] w-full overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800">
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
					<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 flex items-center justify-center">
						<button
							onClick={() => setIsQuickViewOpen(true)}
							className="pointer-events-auto translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white px-6 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-white dark:hover:bg-slate-800 hover:scale-105"
						>
							<Eye className="w-4 h-4" />
							Quick View
						</button>
					</div>
					<div className="absolute right-3 top-3 z-10">
						<WishlistButton productId={id} />
					</div>
				</div>
				<div className="flex flex-1 flex-col gap-4 p-5">
					<div className="space-y-1">
						<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
							{category}
						</p>
						<h3 className="line-clamp-2 text-lg font-semibold text-slate-900 dark:text-white transition-colors">{name}</h3>
						<p className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">${price.toFixed(2)}</p>
						{reviewCount > 0 && (
							<div className="flex items-center gap-1.5 pt-1">
								<RatingStars rating={averageRating} size={14} />
								<span className="text-xs font-medium text-slate-500 dark:text-slate-400">
									{averageRating.toFixed(1)} ({reviewCount})
								</span>
							</div>
						)}
					</div>
					<a
						href={`/products/${id}`}
						className="mt-auto inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(124,58,237,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(124,58,237,0.55)]"
					>
						View Details
					</a>
				</div>
			</motion.article>
			<QuickViewModal
				isOpen={isQuickViewOpen}
				onClose={() => setIsQuickViewOpen(false)}
				product={{ id, name, price, image, category, averageRating, reviewCount }}
			/>
		</>
	);
}
