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
		<main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
			<div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[260px_1fr]">
				<AdminSidebar />
				<section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
					<h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
					<p className="mt-2 text-sm text-slate-600">
						Manage products and monitor orders from one place.
					</p>

					<div className="mt-8 grid gap-4 sm:grid-cols-2">
						<Link
							href="/admin/products/new"
							className="rounded-xl border border-slate-200 p-4 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
						>
							Add Product
						</Link>
						<Link
							href="/admin/products"
							className="rounded-xl border border-slate-200 p-4 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
						>
							Manage Products
						</Link>
						<Link
							href="/admin/orders"
							className="rounded-xl border border-slate-200 p-4 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
						>
							View Orders
						</Link>
					</div>
				</section>
			</div>
		</main>
	);
}
