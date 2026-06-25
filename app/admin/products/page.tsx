import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import AdminSidebar from "@/components/AdminSidebar";

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

async function deleteProduct(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id)) {
    redirect("/admin/products?error=invalid");
  }

  const response = await fetch(`${getBaseUrl()}/api/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    redirect("/admin/products?error=delete");
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export default async function ManageProductsPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  await requireAdmin();

  const products = await prisma.product.findMany({
    select: { id: true, name: true, price: true, stock: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen px-4 py-10 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[260px_1fr]">
        <AdminSidebar />
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white transition-colors">Manage Products</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 transition-colors">
                Update pricing, stock, and product details.
              </p>
            </div>
            <Link
              href="/admin/products/new"
              className="rounded-lg bg-slate-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-slate-200"
            >
              Add Product
            </Link>
          </div>

          {searchParams?.error ? (
            <p className="mt-4 text-sm font-semibold text-rose-600">
              Unable to update products. Try again.
            </p>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 transition-colors">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400 transition-colors">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-t border-slate-200 dark:border-slate-700 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white transition-colors">
                        {product.name}
                      </td>
                      <td className="px-4 py-3">₹{product.price.toFixed(2)}</td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                            Edit
                          </Link>
                          <form action={deleteProduct}>
                            <input type="hidden" name="id" value={product.id} />
                            <button
                              type="submit"
                              className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
