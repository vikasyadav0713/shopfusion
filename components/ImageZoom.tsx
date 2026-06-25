"use client";

import { useState, useRef, MouseEvent, TouchEvent } from "react";
import ProductImage from "@/components/ProductImage";

type ImageZoomProps = {
  name: string;
  src: string;
  alt: string;
  category?: string;
  className?: string;
};

export default function ImageZoom({ name, src, alt, category, className = "" }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const touch = e.touches[0];
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((touch.clientX - left) / width) * 100;
    const y = ((touch.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      ref={imageRef}
      className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-2xl cursor-zoom-in ${className}`}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => { setIsZoomed(false); setPosition({ x: 50, y: 50 }); }}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsZoomed(true)}
      onTouchEnd={() => { setIsZoomed(false); setPosition({ x: 50, y: 50 }); }}
      onTouchMove={handleTouchMove}
    >
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: isZoomed ? `scale(2)` : `scale(1)`,
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
      >
        <ProductImage
          name={name}
          src={src}
          alt={alt}
          category={category}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
