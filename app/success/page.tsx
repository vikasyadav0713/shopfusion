export default function SuccessPage() {
	return (
		<main className="min-h-screen px-4 py-16 sm:px-8">
			<div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 p-10 text-center shadow-sm">
				<div className="text-4xl">🎉</div>
				<h1 className="text-3xl font-semibold text-slate-900 dark:text-white transition-colors">Payment Successful</h1>
				<p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
					Thank you for your purchase. Your order is now being processed.
				</p>
				<a
					href="/"
					className="mt-2 inline-flex items-center justify-center rounded-lg bg-slate-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-slate-200"
				>
					Continue shopping
				</a>
			</div>
		</main>
	);
}
