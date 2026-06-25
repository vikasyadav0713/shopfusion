"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ArrowUp,
  ArrowRight,
  ShieldCheck,
  Truck,
  Award,
  Mail
} from "lucide-react";

// Custom Payment Icons
const VisaIcon = () => (
  <svg viewBox="0 0 36 24" fill="none" className="h-6 w-9">
    <rect width="36" height="24" rx="4" className="fill-white" />
    <path d="M12.8 17l1.7-10h2.7l-2.6 10h-1.8zm8.5-9.8c-.5-.2-1.2-.4-2-.4-2.1 0-3.7 1.1-3.7 2.7 0 1.2 1.1 1.9 1.9 2.3.8.4 1.1.6 1.1 1 0 .5-.6.8-1.2.8-.8 0-1.5-.2-2-.5l-.3 1.3c.5.2 1.3.4 2.1.4 2.3 0 3.8-1.1 3.8-2.8 0-1.6-2.2-1.7-2.2-2.4 0-.3.3-.6 1.1-.7.6-.1 1.2.1 1.6.3l.3-1.4zm6.6 6.8h2.1l-2-9.6h-2.1c-.4 0-.8.2-1 .6l-3.8 9h2.8l.5-1.5h3.4l.3 1.5zm-3-4.1l.8-2.3.5 2.3h-1.3zm-14.7.1l-1.6-4.2h-2.8l3.6 8.2h3l2.8-9.8h-2.8l-2.2 5.8z" fill="#1434CB" />
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 36 24" fill="none" className="h-6 w-9">
    <rect width="36" height="24" rx="4" className="fill-white" />
    <circle cx="15" cy="12" r="6" fill="#EB001B" fillOpacity="0.8" />
    <circle cx="21" cy="12" r="6" fill="#F79E1B" fillOpacity="0.8" />
  </svg>
);

const PaypalIcon = () => (
  <svg viewBox="0 0 36 24" fill="none" className="h-6 w-9">
    <rect width="36" height="24" rx="4" className="fill-white" />
    <path d="M11 16.5h2l1-6.5h3.5c1.5 0 2.5-.5 3-1.5.3-.8.2-2-.5-3-1-1-2.5-1-4-1H11.5c-.3 0-.5.2-.5.5l-1.5 10c0 .2.2.5.5.5zm3.5-9h2.5c1 0 1.5.3 1.7.8.2.5.2 1.2-.2 1.7-.5 1-1.5 1-2.5 1H14l.5-3.5z" fill="#003087" />
    <path d="M14.5 17h2.5l1-6h3.5c1.5 0 2.5-.5 3-1.5.3-.8.2-2-.5-3-1-1-2.5-1-4-1h-3l-2.5 11.5z" fill="#0079C1" fillOpacity="0.8" />
  </svg>
);

const GithubIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast.success("Subscribed successfully!");
    setEmail("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: GithubIcon, href: "#", label: "GitHub" },
    { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
    { icon: TwitterIcon, href: "#", label: "Twitter" },
    { icon: InstagramIcon, href: "#", label: "Instagram" },
  ];

  return (
    <div className="relative mt-40">
      
      {/* 1. Main Footer Container with responsive Light/Dark Background Identity */}
      <footer className="relative bg-slate-50 dark:bg-[#040A15] pt-12 text-slate-600 dark:text-slate-300 transition-colors duration-300 border-t border-slate-200 dark:border-transparent">
        
        {/* Soft Background Gradient Spotlight */}
        <div className="pointer-events-none absolute left-0 top-0 h-[400px] w-full bg-gradient-to-b from-slate-200/50 dark:from-[#0F172A]/50 to-transparent" />

        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          
          {/* 3. Floating Newsletter Card */}
          <div className="relative -mt-32 mb-24 flex flex-col items-center justify-between gap-8 rounded-3xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-slate-800/40 p-8 shadow-xl backdrop-blur-2xl lg:flex-row lg:px-16 lg:py-12 z-20 overflow-hidden">
            
            {/* The strong soft white/blue glow right behind the newsletter text */}
            <div className="absolute left-1/4 top-1/2 -z-10 h-64 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 dark:bg-indigo-300/20 blur-[100px]" />
            <div className="absolute right-1/4 top-1/2 -z-10 h-64 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 dark:bg-cyan-300/10 blur-[100px]" />
            
            <div className="relative z-10 w-full max-w-lg text-center lg:text-left">
              <h3 className="flex items-center justify-center gap-3 text-[28px] font-bold tracking-tight text-slate-900 dark:text-white lg:justify-start">
                <span className="flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 p-3 border border-slate-200 dark:border-white/10 shadow-inner">
                  <Mail className="h-6 w-6 text-slate-700 dark:text-white" />
                </span>
                Join our newsletter
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
                Get early access to new products, exclusive deals, and curated tech news delivered straight to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="relative z-10 flex w-full max-w-[500px] flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-[#4F5B73]/60 px-6 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-300 outline-none transition-colors focus:border-slate-300 dark:focus:border-white/30 focus:bg-white dark:focus:bg-[#4F5B73]/80 shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-8 py-4 text-sm font-bold text-white dark:text-slate-900 transition-all hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-70"
              >
                Subscribe
                {!isSubmitting && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
              </button>
            </form>
          </div>

          {/* 4. Main Footer Content */}
          <div className="grid grid-cols-1 gap-16 pb-16 pt-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            
            {/* 5. Brand Section */}
            <div className="flex flex-col space-y-6 lg:col-span-5 pr-8">
              <Link href="/" className="group flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 dark:border-transparent p-1 shadow-sm">
                  <Image src="/logo.png" alt="ShopFusion Logo" width={32} height={32} className="object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[22px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">ShopFusion</span>
                  <span className="text-[13px] font-bold text-cyan-600 dark:text-cyan-400">Where Shopping Meets Innovation</span>
                </div>
              </Link>
              
              <p className="max-w-sm text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                Premium e-commerce platform delivering quality products with a seamless, modern shopping experience. Discover curated essentials built for the modern professional.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-3 text-[13px] font-bold text-slate-700 dark:text-white">
                  <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  Secure checkout & payments
                </div>
                <div className="flex items-center gap-3 text-[13px] font-bold text-slate-700 dark:text-white">
                  <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                    <Truck className="h-4 w-4" />
                  </span>
                  Fast & reliable global delivery
                </div>
                <div className="flex items-center gap-3 text-[13px] font-bold text-slate-700 dark:text-white">
                  <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400">
                    <Award className="h-4 w-4" />
                  </span>
                  Curated premium products
                </div>
              </div>

              {/* 6. Social Icons */}
              <div className="flex gap-4 pt-8">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    title={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-300 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    <social.icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            <div className="lg:col-span-2 lg:ml-auto">
              <h3 className="mb-6 text-xs font-bold tracking-[0.15em] text-slate-900 dark:text-white">SHOP</h3>
              <ul className="space-y-4 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                {['All Products', 'Categories', 'New Arrivals', 'Best Sellers', 'Deals'].map((link) => (
                  <li key={link}>
                    <Link href="#" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 lg:ml-auto">
              <h3 className="mb-6 text-xs font-bold tracking-[0.15em] text-slate-900 dark:text-white">SUPPORT</h3>
              <ul className="space-y-4 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                {['Help Center', 'Contact Us', 'FAQs', 'Shipping Policy', 'Returns'].map((link) => (
                  <li key={link}>
                    <Link href="#" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3 lg:ml-auto">
              <h3 className="mb-6 text-xs font-bold tracking-[0.15em] text-slate-900 dark:text-white">COMPANY</h3>
              <ul className="space-y-4 text-[13px] font-medium text-slate-600 dark:text-slate-400">
                {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Blog'].map((link) => (
                  <li key={link}>
                    <Link href="#" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* 12. Bottom Bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-slate-200 dark:border-slate-800/80 py-8 lg:flex-row relative z-10">
            <div className="flex flex-col items-center gap-2 lg:items-start text-xs font-medium text-slate-500 dark:text-slate-400">
              <p>© 2026 ShopFusion Inc. All rights reserved.</p>
              <p className="text-slate-400 dark:text-slate-500">
                Crafted with Next.js <span className="mx-1">•</span> Hosted on Vercel
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <div className="flex h-[26px] items-center justify-center rounded bg-slate-100 dark:bg-slate-900 px-2.5 border border-slate-200 dark:border-slate-800">
                <VisaIcon />
              </div>
              <div className="flex h-[26px] items-center justify-center rounded bg-slate-100 dark:bg-slate-900 px-2.5 border border-slate-200 dark:border-slate-800">
                <MastercardIcon />
              </div>
              <div className="flex h-[26px] items-center justify-center rounded bg-slate-100 dark:bg-slate-900 px-2.5 border border-slate-200 dark:border-slate-800">
                <PaypalIcon />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-8 right-8 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-slate-600 dark:text-white shadow-xl transition-all hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
