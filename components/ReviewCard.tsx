"use client";

import { useState } from "react";
import RatingStars from "./RatingStars";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";

type ReviewCardProps = {
  review: {
    id: number;
    rating: number;
    title: string | null;
    text: string;
    userId: string;
    verifiedPurchase: boolean;
    helpfulCount: number;
    createdAt: string;
  };
  onReviewDeleted: () => void;
};

export default function ReviewCard({ review, onReviewDeleted }: ReviewCardProps) {
  const { userId } = useAuth();
  const isOwner = userId === review.userId;
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleHelpful = async () => {
    if (!userId) {
      toast.error("Sign in to vote");
      return;
    }
    try {
      const res = await axios.post(`/api/reviews/${review.id}/helpful`);
      if (res.data.action === "added") {
        setHelpfulCount(c => c + 1);
        toast.success("Marked as helpful");
      } else {
        setHelpfulCount(c => c - 1);
        toast.success("Vote removed");
      }
    } catch (error) {
      toast.error("Failed to register vote");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your review?")) return;
    setIsDeleting(true);
    try {
      await axios.delete(`/api/reviews/${review.id}`);
      toast.success("Review deleted");
      onReviewDeleted();
    } catch (error) {
      toast.error("Failed to delete review");
      setIsDeleting(false);
    }
  };

  return (
    <div className="py-6 border-b border-slate-100 last:border-0">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center text-violet-700 font-bold uppercase shrink-0">
            {/* Generate random avatar letter based on userId for now, since Clerk data isn't fetched DB side */}
            {review.userId.substring(5, 6)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">Shopper</span>
              {review.verifiedPurchase && (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm text-rose-500 hover:text-rose-600 transition"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      <div className="mb-2">
        <RatingStars rating={review.rating} size={16} />
      </div>

      {review.title && <h4 className="font-semibold text-slate-800 mb-1">{review.title}</h4>}
      <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{review.text}</p>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleHelpful}
          className="group flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 group-hover:text-violet-500 transition-colors"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
          Helpful ({helpfulCount})
        </button>
      </div>
    </div>
  );
}
