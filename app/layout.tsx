import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
	title: "ShopFusion - Modern eCommerce Platform",
	description:
		"ShopFusion is a modern, fast, and scalable eCommerce platform built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased transition-colors duration-300">
				<ClerkProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<div className="flex min-h-screen flex-col">
							<Navbar />
							<CartDrawer />
							<div className="flex-1">
								{children}
							</div>
							<Footer />
						</div>
						<Toaster position="bottom-right" />
					</ThemeProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
