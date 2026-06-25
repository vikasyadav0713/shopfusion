import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import AdminSidebar from "@/components/AdminSidebar";

async function requireAdmin() {
	const { userId } = auth();

	if (!userId) {
		redirect("/");
	}

	const adminEmails = (process.env.ADMIN_EMAILS ?? "")
		.split(",")
		.map((email) => email.trim().toLowerCase())
		.filter(Boolean);

	if (adminEmails.length === 0) {
		redirect("/");
	}

	const user = await clerkClient.users.getUser(userId);
	const primaryEmail =
		user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)
			?.emailAddress ??
		user.emailAddresses[0]?.emailAddress;

	if (!primaryEmail || !adminEmails.includes(primaryEmail.toLowerCase())) {
		redirect("/");
	}
}

export default async function AdminDashboardPage() {
	await requireAdmin();

	return (
		<main className="min-h-screen px-4 py-10 sm:px-8">
			<div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[260px_1fr]">
				<AdminSidebar />
				<section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 p-8 shadow-sm">
					<h1 className="text-2xl font-semibold text-slate-900 dark:text-white transition-colors">Admin Dashboard</h1>
					<p className="mt-2 text-sm text-slate-600 dark:text-slate-400 transition-colors">
						Manage products and monitor orders from one place.
					</p>

					<div className="mt-8 grid gap-4 sm:grid-cols-2">
						<Link
							href="/admin/products/new"
							className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-sm font-semibold text-slate-900 dark:text-slate-200 transition-colors hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
						>
							Add Product
						</Link>
						<Link
							href="/admin/products"
							className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-sm font-semibold text-slate-900 dark:text-slate-200 transition-colors hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
						>
							Manage Products
						</Link>
						<Link
							href="/admin/orders"
							className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-sm font-semibold text-slate-900 dark:text-slate-200 transition-colors hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
						>
							View Orders
						</Link>
					</div>
				</section>
			</div>
		</main>
	);
}
