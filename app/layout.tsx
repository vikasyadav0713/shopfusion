import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
	title: "ShopFusion - Modern eCommerce Platform",
	description:
		"ShopFusion is a modern, fast, and scalable eCommerce platform built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 text-slate-900 antialiased">
				<ClerkProvider>
					<Navbar />
					{children}
				</ClerkProvider>
			</body>
		</html>
	);
}
