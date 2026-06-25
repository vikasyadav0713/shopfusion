import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
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

export default async function OrdersPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    select: { id: true, totalAmount: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen px-4 py-10 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[260px_1fr]">
        <AdminSidebar />
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white transition-colors">Orders</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 transition-colors">Track recent purchases.</p>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 transition-colors">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400 transition-colors">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-t border-slate-200 dark:border-slate-700 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white transition-colors">{order.id}</td>
                      <td className="px-4 py-3">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-3">{order.status}</td>
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
