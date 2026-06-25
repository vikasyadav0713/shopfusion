"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  Cpu,
  Truck,
  Box,
  MonitorSmartphone,
  Shirt,
  Armchair,
  Dumbbell
} from "lucide-react";
import Image from "next/image";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

export default function LandingClient({ featuredProducts }: { featuredProducts: Product[] }) {
  const [randomProduct, setRandomProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (featuredProducts && featuredProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * featuredProducts.length);
      setRandomProduct(featuredProducts[randomIndex]);
    }
  }, [featuredProducts]);

  const displayImage = randomProduct?.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop";
  const displayCategory = randomProduct?.category || "Audio Category";
  const displayName = randomProduct?.name || "Sony WH-1000XM5";

  return (
    <main className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1121] text-slate-600 dark:text-slate-300 selection:bg-violet-500/30 selection:text-violet-900 dark:selection:text-violet-200 overflow-hidden transition-colors duration-300">

      {/* 1. HOLOGRAPHIC HERO SHOWCASE */}
      <section className="relative flex min-h-[95vh] flex-col items-center justify-center pt-24 pb-16 overflow-hidden">

        {/* Massive 3D Glow Blobs - Light & Dark */}
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/15 dark:bg-violet-600/15 blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 dark:bg-cyan-500/15 blur-[80px] pointer-events-none z-0" />

        <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left: Typography */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-semibold text-violet-700 dark:text-violet-400 backdrop-blur-md shadow-sm dark:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
              <Sparkles className="h-4 w-4" />
              <span>ShopFusion Premium Experience</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="mb-6 text-5xl font-black tracking-tight text-slate-900 dark:text-white sm:text-7xl lg:text-[5.5rem] leading-[1.05]">
              The Ultimate <br />
              <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-cyan-500 dark:from-violet-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                Shopping Destination.
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mb-10 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 mx-auto lg:mx-0">
              Curated. Elevated. Designed for the modern professional. Discover the world's most premium tech and lifestyle products in one seamless platform.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-white px-8 py-4 text-[15px] font-bold text-white dark:text-slate-900 transition-all hover:scale-[1.03] active:scale-95 shadow-xl dark:shadow-[0_0_40px_rgba(255,255,255,0.15)] overflow-hidden"
              >
                {/* Button Hover Glow */}
                <div className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-transform duration-500 group-hover:translate-y-0" />
                <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-white">
                  Start Exploring
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Holographic Product Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative w-full aspect-square max-w-lg lg:max-w-none perspective-1000"
          >
            {/* Background Rings (Static base to prevent GPU lag from animated backdrop filters) */}
            <div className="absolute inset-4 sm:inset-10 rounded-full border border-slate-200 dark:border-white/5 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md shadow-2xl" />
            <div className="absolute inset-8 sm:inset-14 rounded-full border border-violet-500/20 border-dashed animate-[spin_40s_linear_infinite_reverse]" />

            <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, rotateZ: -2, y: -25 }}
                className="relative w-full max-w-[260px] sm:max-w-[320px] aspect-square cursor-pointer z-10 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-900 group"
              >
                <Image
                  src={displayImage}
                  alt={displayName}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 border border-black/5 dark:border-white/10 rounded-[2.5rem] pointer-events-none" />
              </motion.div>
            </div>

            {/* Holographic Floating Tags */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/4 right-0 rounded-xl border border-white dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-3 backdrop-blur-md shadow-xl z-20"
            >
              <div className="text-xs font-bold text-violet-600 dark:text-violet-400">{displayCategory}</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[150px]">{displayName}</div>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* 2. CATEGORY MODULES */}
      <section className="relative z-20 mx-auto -mt-10 w-full max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {[
            { label: "Electronics", count: "Tech & Gadgets", icon: MonitorSmartphone, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-500/10", borderHover: "hover:border-violet-500/50" },
            { label: "Fashion", count: "Apparel & Style", icon: Shirt, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-500/10", borderHover: "hover:border-cyan-500/50" },
            { label: "Home & Living", count: "Modern Essentials", icon: Armchair, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-500/10", borderHover: "hover:border-indigo-500/50" },
            { label: "Fitness", count: "Active Lifestyle", icon: Dumbbell, color: "text-fuchsia-600 dark:text-fuchsia-400", bg: "bg-fuchsia-100 dark:bg-fuchsia-500/10", borderHover: "hover:border-fuchsia-500/50" },
          ].map((cat, i) => (
            <Link href={`/?category=${cat.label}#shop`} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`group flex flex-col justify-between h-40 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/70 dark:bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl transition-all duration-300 ${cat.borderHover} hover:bg-white dark:hover:bg-slate-800/80 cursor-pointer`}
              >
                <div className="flex justify-between items-start">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.bg} ${cat.color} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                    <cat.icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 px-2.5 py-1 backdrop-blur-md">
                    <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-300 uppercase">{cat.count}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">{cat.label}</h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. THE ARSENAL (FEATURED PRODUCTS) */}
      <section className="relative py-32 overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-violet-600 dark:text-violet-400 uppercase">
                <Box className="h-4 w-4" /> ShopFusion Highlights
              </div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Top Tier Essentials.</h2>
            </div>
            <Link href="/shop" className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white">
              Access Full Catalog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product, i) => (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="group relative flex h-full flex-col rounded-3xl border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/40 p-3 backdrop-blur-md transition-all duration-300 hover:border-violet-500/30 dark:hover:border-violet-500/30 hover:bg-white dark:hover:bg-slate-800/60 shadow-lg dark:shadow-xl hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-violet-500/0 to-cyan-500/0 opacity-0 blur-xl transition-all duration-500 group-hover:from-violet-500/10 group-hover:to-cyan-500/10 group-hover:opacity-100" />

                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-white/5 p-8">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-6 drop-shadow-lg dark:drop-shadow-xl transition-transform duration-500 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>

                    <div className="flex flex-col flex-1 justify-between p-4">
                      <div>
                        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">{product.category}</div>
                        <h3 className="line-clamp-2 text-lg font-bold text-slate-900 dark:text-white">{product.name}</h3>
                      </div>
                      <div className="mt-4 text-xl font-black text-slate-900 dark:text-white">
                        ₹{product.price.toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                No featured products currently available.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. THE PIPELINE */}
      <section className="relative border-y border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-[#08101E] py-32">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-20 mix-blend-overlay pointer-events-none" />

        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 relative z-10">
          <div className="mb-16 md:mb-24 text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">The Seamless Journey</h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400 mx-auto">A hyper-optimized, zero-friction journey from product discovery to final delivery.</p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 relative">

            {/* Neon Track Line (Hidden on mobile) */}
            <div className="hidden md:block absolute top-6 left-12 right-12 h-1 bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-violet-500 via-cyan-500 to-transparent blur-[1px] animate-[pulse_3s_ease-in-out_infinite]" />
            </div>

            {[
              { step: "01", title: "Smart Discovery", desc: "Browse through an expertly curated catalog of high-end lifestyle products." },
              { step: "02", title: "Quick Selection", desc: "Instantly add items to your secure digital cart." },
              { step: "03", title: "Secure Checkout", desc: "Enterprise-grade checkout processes your transaction securely." },
              { step: "04", title: "Rapid Delivery", desc: "Automated logistics dispatch your order via lightning fast delivery." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border-4 border-slate-100 dark:border-[#08101E] bg-white dark:bg-slate-800 text-lg font-black text-slate-900 dark:text-white relative z-10 transition-colors duration-300 shadow-md group-hover:bg-violet-500 group-hover:text-white dark:group-hover:bg-violet-500 dark:group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                  {item.step}
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRUST METRICS */}
      <section className="py-24">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 border border-slate-200 dark:border-white/5 bg-white/60 dark:bg-slate-900/30 rounded-3xl p-12 backdrop-blur-lg shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">256-bit Secure</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Encrypted Transactions</p>
              </div>
            </div>
            <div className="hidden md:block h-12 w-[1px] bg-slate-200 dark:bg-white/10" />
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Globe2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Global Shipping</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Lightning fast routing</p>
              </div>
            </div>
            <div className="hidden md:block h-12 w-[1px] bg-slate-200 dark:bg-white/10" />
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">24/7 Support</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Always online assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
