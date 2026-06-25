"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import RatingStars from "./RatingStars";
import { useAuth } from "@clerk/nextjs";

type WriteReviewFormProps = {
  productId: number;
  onReviewSubmitted: () => void;
  onCancel: () => void;
};

export default function WriteReviewForm({ productId, onReviewSubmitted, onCancel }: WriteReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSignedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast.error("Please sign in to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (text.length < 20) {
      toast.error("Review must be at least 20 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`/api/products/${productId}/reviews`, {
        rating,
        title,
        text,
      });
      toast.success("Review submitted successfully!");
      onReviewSubmitted();
    } catch (error: any) {
      const msg = error.response?.data?.error || "Failed to submit review";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
      <h3 className="text-xl font-semibold mb-4 text-slate-900">Write a Review</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Overall Rating *</label>
        <RatingStars rating={rating} onRatingChange={setRating} interactive size={28} />
      </div>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
          Review Title (Optional)
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          maxLength={100}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="text" className="block text-sm font-medium text-slate-700 mb-1">
          Review *
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did you like or dislike? What should other shoppers know?"
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none"
          maxLength={1000}
        />
        <div className="mt-1 text-right text-xs text-slate-400">
          {text.length} / 1000 characters (Min: 20)
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || text.length < 20 || rating === 0}
          className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
}
