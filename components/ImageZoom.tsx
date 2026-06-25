"use client";

import { useState, useRef, MouseEvent, TouchEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type ImageZoomProps = {
  src: string;
  alt: string;
  category?: string;
  className?: string;
};

export default function ImageZoom({ src, alt, category, className = "" }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
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
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsZoomed(true)}
      onTouchEnd={() => setIsZoomed(false)}
      onTouchMove={handleTouchMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`object-cover transition-opacity duration-300 ${isZoomed ? "opacity-0" : "opacity-100"}`}
        priority
      />

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${src})`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundSize: "200%",
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
