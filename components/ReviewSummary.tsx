import RatingStars from "./RatingStars";

type ReviewSummaryProps = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>; // { 5: 10, 4: 2, etc. }
};

export default function ReviewSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
}: ReviewSummaryProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 rounded-2xl bg-white dark:bg-slate-900 transition-colors duration-300 p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      {/* Average Rating Block */}
      <div className="flex flex-col items-center justify-center min-w-[150px]">
        <h3 className="text-5xl font-bold text-slate-900 dark:text-white transition-colors mb-2">
          {averageRating.toFixed(1)}
        </h3>
        <RatingStars rating={Math.round(averageRating)} size={24} className="mb-2" />
        <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Based on {totalReviews} Reviews</p>
      </div>

      {/* Distribution Bars */}
      <div className="flex-1 w-full space-y-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingDistribution[star] || 0;
          const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

          return (
            <div key={star} className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors w-12 shrink-0">
                {star} <span className="text-yellow-400 text-lg">★</span>
              </span>
              <div className="relative h-2.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 transition-colors overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-yellow-400 transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400 transition-colors w-10 text-right shrink-0">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
