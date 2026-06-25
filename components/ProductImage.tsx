"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { getProductImageCandidates } from "@/lib/getProductImageClient";

type ProductImageProps = {
	/** The product name — used to resolve the local image file. */
	name: string;
	/**
	 * Optional explicit `src` override.
	 * If this is a local `/products/...` path it is used directly.
	 * Otherwise the component resolves from `name`.
	 */
	src?: string;
	alt: string;
	category?: string;
	width?: number;
	height?: number;
	fill?: boolean;
	className?: string;
	sizes?: string;
	priority?: boolean;
};

const PLACEHOLDER = "/products/placeholder.svg";

export default function ProductImage({
	name,
	src,
	alt,
	width,
	height,
	fill,
	className,
	sizes,
	priority,
}: ProductImageProps) {
	// Build the ordered list of candidate image URLs to try
	const candidates = useMemo(() => {
		// If an explicit local src is provided that looks like a real path, try it first
		if (src && src.startsWith("/products/") && src !== PLACEHOLDER) {
			return [src, ...getProductImageCandidates(name)];
		}
		return getProductImageCandidates(name);
	}, [name, src]);

	const attemptRef = useRef(0);
	const [imgSrc, setImgSrc] = useState(candidates[0] ?? PLACEHOLDER);
	const [isLoaded, setIsLoaded] = useState(false);

	const handleError = useCallback(() => {
		attemptRef.current += 1;
		if (attemptRef.current < candidates.length) {
			setImgSrc(candidates[attemptRef.current]);
			setIsLoaded(false);
		} else {
			// All candidates exhausted — stick with placeholder
			setImgSrc(PLACEHOLDER);
		}
	}, [candidates]);

	return (
		<div className="relative h-full w-full">
			{!isLoaded ? (
				<div className="absolute inset-0 animate-pulse rounded-[inherit] bg-slate-200" />
			) : null}
			<Image
				src={imgSrc}
				alt={alt}
				width={width}
				height={height}
				fill={fill}
				sizes={sizes}
				className={className}
				onError={handleError}
				onLoad={() => setIsLoaded(true)}
				priority={priority}
				unoptimized={imgSrc.endsWith(".svg")}
			/>
		</div>
	);
}
