import { redirect, notFound } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/AdminSidebar";

type PageProps = {
	params: { id: string };
	searchParams?: { error?: string };
};

function getBaseUrl() {
	const headerList = headers();
	const host = headerList.get("host");
	const proto = headerList.get("x-forwarded-proto") ?? "http";

	if (!host) {
		return "http://localhost:3000";
	}

	return `${proto}://${host}`;
}

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

async function updateProduct(formData: FormData) {
	"use server";

	const id = Number(formData.get("id"));
	const name = String(formData.get("name") ?? "").trim();
	const price = Number(formData.get("price"));
	const description = String(formData.get("description") ?? "").trim();
	const imagesRaw = String(formData.get("images") ?? "").trim();
	const images = imagesRaw
		.split(/[\n,]+/)
		.map((value) => value.trim())
		.filter(Boolean);
	const stock = Number(formData.get("stock"));

	if (!Number.isInteger(id)) {
		redirect("/admin/products?error=invalid");
	}

	const response = await fetch(`${getBaseUrl()}/api/products/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name, price, description, images, stock }),
	});

	if (!response.ok) {
		redirect(`/admin/products/${id}/edit?error=failed`);
	}

	redirect("/admin/products");
}

export default async function EditProductPage({ params, searchParams }: PageProps) {
	await requireAdmin();

	const productId = Number(params.id);

	if (!Number.isInteger(productId)) {
		notFound();
	}

	const product = await prisma.product.findUnique({ where: { id: productId } });

	if (!product) {
		notFound();
	}

	return (
		<main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
			<div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[260px_1fr]">
				<AdminSidebar />
				<section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
					<h1 className="text-2xl font-semibold text-slate-900">Edit Product</h1>
					<p className="mt-2 text-sm text-slate-600">Update product details.</p>

					{searchParams?.error ? (
						<p className="mt-4 text-sm font-semibold text-rose-600">
							Unable to update product. Try again.
						</p>
					) : null}

					<form action={updateProduct} className="mt-6 space-y-4">
						<input type="hidden" name="id" value={product.id} />
						<div>
							<label htmlFor="product-name" className="text-sm font-medium text-slate-700">
								Name
							</label>
							<input
								id="product-name"
								name="name"
								required
								defaultValue={product.name}
								title="Product name"
								className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
							/>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div>
								<label htmlFor="product-price" className="text-sm font-medium text-slate-700">
									Price
								</label>
								<input
									id="product-price"
									name="price"
									type="number"
									step="0.01"
									required
									defaultValue={product.price}
									title="Product price"
									className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
								/>
							</div>
							<div>
								<label htmlFor="product-stock" className="text-sm font-medium text-slate-700">
									Stock
								</label>
								<input
									id="product-stock"
									name="stock"
									type="number"
									min="0"
									required
									defaultValue={product.stock}
									title="Available stock"
									className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
								/>
							</div>
						</div>
						<div>
							<label htmlFor="product-images" className="text-sm font-medium text-slate-700">
								Image URLs
							</label>
							<textarea
								id="product-images"
								name="images"
								required
								rows={3}
								defaultValue={product.images.join(", ")}
								title="Image URLs"
								className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
							/>
							<p className="mt-2 text-xs text-slate-500">
								Add multiple URLs separated by commas or new lines.
							</p>
						</div>
						<div>
							<label
								htmlFor="product-description"
								className="text-sm font-medium text-slate-700"
							>
								Description
							</label>
							<textarea
								id="product-description"
								name="description"
								rows={4}
								required
								defaultValue={product.description}
								title="Product description"
								className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
							/>
						</div>
						<button
							type="submit"
							className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
						>
							Save Changes
						</button>
					</form>
				</section>
			</div>
		</main>
	);
}
