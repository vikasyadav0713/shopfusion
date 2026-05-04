import Link from "next/link";

const navItems = [
	{ href: "/admin", label: "Dashboard" },
	{ href: "/admin/products", label: "Products" },
	{ href: "/admin/orders", label: "Orders" },
];

export default function AdminSidebar() {
	return (
		<aside className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
			<div className="space-y-1">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
					ShopFusion
				</p>
				<h2 className="text-lg font-semibold text-slate-900">Admin Panel</h2>
			</div>
			<nav className="flex flex-col gap-2">
				{navItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
					>
						{item.label}
					</Link>
				))}
			</nav>
		</aside>
	);
}
