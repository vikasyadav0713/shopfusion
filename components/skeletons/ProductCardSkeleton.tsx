export default function ProductCardSkeleton() {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-[210px] w-full bg-slate-200 dark:bg-slate-800" />
      
      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-3">
          {/* Category */}
          <div className="h-3 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
          
          {/* Title */}
          <div className="space-y-2">
            <div className="h-5 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          
          {/* Price */}
          <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800 pt-2" />
        </div>
        
        {/* Button */}
        <div className="mt-auto h-10 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
    </article>
  );
}
