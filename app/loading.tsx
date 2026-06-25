import ProductCardSkeleton from "@/components/skeletons/ProductCardSkeleton";

export default function Loading() {
  return (
    <main className="px-4 pb-24 pt-8 sm:px-8 min-h-screen transition-colors duration-300">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10">
        {/* Top Hero Section Skeleton */}
        <section className="relative overflow-hidden rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm sm:p-12 animate-pulse h-64" />

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Filter Sidebar Skeleton */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="h-[600px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
          </div>

          {/* Product Grid Area Skeleton */}
          <div className="flex-1 w-full min-w-0">
            {/* Grid Header Skeleton */}
            <div className="h-16 mb-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 animate-pulse" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
