"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { submitReview } from "@/lib/reviews-api";
import { ApiError } from "@/lib/api";

interface ReviewSubmitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  onSuccess: () => void;
}

export default function ReviewSubmitModal({
  open,
  onOpenChange,
  productId,
  onSuccess,
}: ReviewSubmitModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setRating(0);
    setHoveredRating(0);
    setTitle("");
    setComment("");
    setLoading(false);
    setError("");
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) reset();
    onOpenChange(isOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Comment must be at least 10 characters.");
      return;
    }

    setLoading(true);
    try {
      await submitReview(productId, {
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
      });
      toast.success("Review submitted! It will appear after approval.");
      reset();
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to submit review.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const displayRating = hoveredRating || rating;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-white/[0.08] bg-[#1a1a1a] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Write a Review</DialogTitle>
          <DialogDescription className="text-white/50">
            Share your experience with this product.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating Picker */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={star <= displayRating ? "#fbbf24" : "none"}
                    stroke={star <= displayRating ? "#fbbf24" : "rgba(255,255,255,0.2)"}
                    strokeWidth={1.5}
                    className="h-8 w-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                </button>
              ))}
              {displayRating > 0 && (
                <span className="ml-2 text-sm text-white/50">
                  {displayRating}/5
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="review-title"
              className="mb-1.5 block text-sm font-medium text-white/70"
            >
              Title{" "}
              <span className="text-white/30">(optional)</span>
            </label>
            <input
              id="review-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={120}
              className="w-full rounded-lg border border-white/[0.08] bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#49A5A2] focus:ring-1 focus:ring-[#49A5A2]"
            />
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="review-comment"
              className="mb-1.5 block text-sm font-medium text-white/70"
            >
              Comment
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others what you liked or disliked about this product..."
              rows={4}
              minLength={10}
              className="w-full resize-none rounded-lg border border-white/[0.08] bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition focus:border-[#49A5A2] focus:ring-1 focus:ring-[#49A5A2]"
            />
            <p className="mt-1 text-xs text-white/30">
              Minimum 10 characters ({comment.trim().length}/10)
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#49A5A2] text-white hover:bg-[#3d8d8a] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
