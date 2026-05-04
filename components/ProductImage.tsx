"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  category: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export default function ProductImage({
  src,
  alt,
  category,
  width,
  height,
  fill,
  className,
  sizes,
  priority,
}: ProductImageProps) {
  const fallbackImage = useMemo(
    () =>
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%25' height='100%25' fill='%23e2e8f0'/><text x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'>Image unavailable</text></svg>",
    []
  );
  const categoryFallbacks: Record<string, string> = {
    electronics: "https://source.unsplash.com/400x300/?electronics,gadgets",
    fashion: "https://source.unsplash.com/400x300/?fashion,style",
    home: "https://source.unsplash.com/400x300/?home,interior",
    fitness: "https://source.unsplash.com/400x300/?fitness,gym",
    books: "https://source.unsplash.com/400x300/?books,library",
  };

  const normalizedSrc = typeof src === "string" ? src.trim() : "";
  const isValidSrc =
    normalizedSrc.startsWith("/") ||
    normalizedSrc.startsWith("http") ||
    normalizedSrc.startsWith("data:");
  const primarySrc = isValidSrc ? normalizedSrc : "";
  const normalizedCategory = typeof category === "string" ? category.toLowerCase() : "";
  const categoryFallback =
    categoryFallbacks[normalizedCategory] ??
    "https://source.unsplash.com/400x300/?product";

  const [imgSrc, setImgSrc] = useState(primarySrc || categoryFallback);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [imgSrc]);

  const handleError = () => {
    if (imgSrc === primarySrc && categoryFallback) {
      setImgSrc(categoryFallback);
      return;
    }
    if (imgSrc !== fallbackImage) {
      setImgSrc(fallbackImage);
    }
  };

  return (
    <div className="relative h-full w-full">
      {!isLoaded ? (
        <div className="absolute inset-0 animate-pulse bg-slate-200" />
      ) : null}
      <Image
        src={imgSrc || fallbackImage}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        className={className}
        onError={handleError}
        onLoadingComplete={() => setIsLoaded(true)}
        priority={priority}
      />
    </div>
  );
}
