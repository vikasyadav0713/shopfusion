export default function Loading() {
  return (
    <main className="px-4 pb-16 pt-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-10 w-3/4 animate-pulse rounded-2xl bg-slate-200" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
