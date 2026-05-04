export default function SuccessPage() {
	return (
		<main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-8">
			<div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
				<div className="text-4xl">🎉</div>
				<h1 className="text-3xl font-semibold text-slate-900">Payment Successful</h1>
				<p className="text-sm text-slate-600">
					Thank you for your purchase. Your order is now being processed.
				</p>
				<a
					href="/"
					className="mt-2 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
				>
					Continue shopping
				</a>
			</div>
		</main>
	);
}
