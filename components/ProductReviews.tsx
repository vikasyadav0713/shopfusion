"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ReviewSummary from "./ReviewSummary";
import WriteReviewForm from "./WriteReviewForm";
import ReviewCard from "./ReviewCard";
import { useAuth } from "@clerk/nextjs";

type ProductReviewsProps = {
  productId: number;
  averageRating: number;
  reviewCount: number;
};

export default function ProductReviews({ productId, averageRating, reviewCount }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isWriting, setIsWriting] = useState(false);
  const { isSignedIn } = useAuth();

  const fetchReviews = async (pageNumber = 1, currentSort = sort) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/products/${productId}/reviews?page=${pageNumber}&sort=${currentSort}`);
      if (pageNumber === 1) {
        setReviews(res.data.reviews);
      } else {
        setReviews(prev => [...prev, ...res.data.reviews]);
      }
      setTotalPages(res.data.pagination.pages);
    } catch (error) {
      console.error("Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1, sort);
  }, [productId, sort]);

  // Calculate local distribution purely from fetched reviews for simplicity 
  // (In a huge app, this would be computed on the backend)
  const distribution = reviews.reduce((acc, r) => {
    acc[r.rating] = (acc[r.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const handleReviewSubmitted = () => {
    setIsWriting(false);
    // Hard refresh to update everything including server-rendered parts 
    // or we could just fetch reviews again
    window.location.reload();
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setPage(1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage, sort);
  };

  return (
    <div className="mt-16 pt-16 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Summary & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <ReviewSummary
            averageRating={averageRating}
            totalReviews={reviewCount}
            ratingDistribution={distribution}
          />

          <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
            <h4 className="font-semibold text-slate-900 dark:text-white transition-colors mb-2">Share your thoughts</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors mb-4">
              If you’ve used this product, share your thoughts with other customers.
            </p>
            <button
              onClick={() => setIsWriting(true)}
              className="w-full py-3 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Right Side: Review List & Form */}
        <div className="lg:col-span-8">
          {isWriting ? (
            <WriteReviewForm
              productId={productId}
              onCancel={() => setIsWriting(false)}
              onReviewSubmitted={handleReviewSubmitted}
            />
          ) : (
            <div>
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <span className="font-medium text-slate-700 dark:text-slate-300 transition-colors">{reviewCount} Reviews</span>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-slate-500 dark:text-slate-400 transition-colors">Sort by:</label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={handleSortChange}
                    className="text-sm font-medium bg-transparent dark:text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="recent" className="dark:bg-slate-900">Most Recent</option>
                    <option value="highest" className="dark:bg-slate-900">Highest Rating</option>
                    <option value="lowest" className="dark:bg-slate-900">Lowest Rating</option>
                    <option value="helpful" className="dark:bg-slate-900">Most Helpful</option>
                  </select>
                </div>
              </div>

              {/* List */}
              {isLoading && page === 1 ? (
                <div className="space-y-6 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl w-full"></div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-2">
                  {reviews.map(review => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onReviewDeleted={handleReviewSubmitted}
                    />
                  ))}

                  {page < totalPages && (
                    <div className="pt-6 text-center">
                      <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="py-2.5 px-6 rounded-full border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
                      >
                        {isLoading ? "Loading..." : "Load More Reviews"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <svg className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors mb-1">No reviews yet</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors max-w-sm mx-auto">
                    Be the first verified buyer to review this product and help others make an informed decision.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
