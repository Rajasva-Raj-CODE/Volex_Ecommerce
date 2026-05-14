"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProductReviews,
  type ProductReview,
  type ProductReviewsResponse,
} from "@/lib/reviews-api";
import ReviewSubmitModal from "./ReviewSubmitModal";
import { Button } from "@/components/ui/button";

function StarIcon({
  filled,
  size = 16,
}: {
  filled: boolean;
  size?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "#fbbf24" : "none"}
      stroke={filled ? "#fbbf24" : "rgba(255,255,255,0.2)"}
      strokeWidth={1.5}
      width={size}
      height={size}
      className="inline-block flex-shrink-0"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  );
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= rating} size={size} />
      ))}
    </span>
  );
}

function formatReviewDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitial(name: string | null) {
  if (!name) return "U";
  return name.charAt(0).toUpperCase();
}

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { isLoggedIn, openLoginModal } = useAuth();
  const [data, setData] = useState<ProductReviewsResponse | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const LIMIT = 5;

  const fetchReviews = useCallback(
    async (pageNum: number, append = false) => {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        const result = await getProductReviews(productId, {
          page: pageNum,
          limit: LIMIT,
        });
        setData(result);
        setReviews((prev) =>
          append ? [...prev, ...result.reviews] : result.reviews
        );
        setPage(pageNum);
      } catch {
        // Silently fail — section just won't show data
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  function handleWriteReview() {
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    setModalOpen(true);
  }

  function handleReviewSuccess() {
    // Refetch from page 1
    fetchReviews(1);
  }

  function handleLoadMore() {
    if (data && page < data.pagination.totalPages) {
      fetchReviews(page + 1, true);
    }
  }

  const avgRating = data?.avgRating ?? 0;
  const totalReviews = data?.totalReviews ?? 0;
  const hasMore = data ? page < data.pagination.totalPages : false;

  return (
    <div className="mb-12">
      <div className="rounded-2xl border border-white/[0.08] bg-[#1a1a1a] p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Ratings & Reviews
            </h2>
            {!loading && totalReviews > 0 && (
              <div className="mt-2 flex items-center gap-3">
                <span className="text-3xl font-bold text-white">
                  {avgRating.toFixed(1)}
                </span>
                <div>
                  <StarRating rating={Math.round(avgRating)} size={18} />
                  <p className="mt-0.5 text-sm text-white/50">
                    Based on {totalReviews} review
                    {totalReviews !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>
          <Button
            onClick={handleWriteReview}
            className="w-full bg-[#49A5A2] text-white hover:bg-[#3d8d8a] sm:w-auto"
          >
            Write a Review
          </Button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-12 text-center text-white/40">
            Loading reviews...
          </div>
        )}

        {/* Empty state */}
        {!loading && reviews.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-white/40">
              No reviews yet. Be the first to review!
            </p>
          </div>
        )}

        {/* Review list */}
        {!loading && reviews.length > 0 && (
          <div className="space-y-0">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`py-5 ${index !== reviews.length - 1 ? "border-b border-white/[0.08]" : ""}`}
              >
                {/* User info + date */}
                <div className="mb-2 flex items-center gap-3">
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name ?? "User"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#49A5A2]/20 text-sm font-semibold text-[#49A5A2]">
                      {getInitial(review.user.name)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {review.user.name ?? "Anonymous"}
                    </p>
                    <p className="text-xs text-white/40">
                      {formatReviewDate(review.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-2">
                  <StarRating rating={review.rating} size={14} />
                </div>

                {/* Title */}
                {review.title && (
                  <p className="mb-1 text-sm font-semibold text-white">
                    {review.title}
                  </p>
                )}

                {/* Comment */}
                <p className="text-sm leading-relaxed text-white/70">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {!loading && hasMore && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="border-white/[0.08] bg-transparent text-white hover:bg-white/5"
            >
              {loadingMore ? "Loading..." : "Load More Reviews"}
            </Button>
          </div>
        )}
      </div>

      {/* Submit Modal */}
      <ReviewSubmitModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        productId={productId}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
}
