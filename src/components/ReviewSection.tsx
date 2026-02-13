"use client";

import { useState, useEffect, useCallback } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  helpful_count: number;
  not_helpful_count: number;
  user_vote: string | null;
}

type SortOption = "newest" | "highest" | "lowest" | "most_helpful";

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`text-lg ${readonly ? "cursor-default" : "cursor-pointer"}`}
          style={{
            color:
              star <= (hover || value) ? "#fbbf24" : "rgba(255,255,255,0.15)",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "highest", label: "Highest Rated" },
  { value: "lowest", label: "Lowest Rated" },
  { value: "most_helpful", label: "Most Helpful" },
];

export default function ReviewSection({
  targetType,
  targetId,
}: {
  targetType: string;
  targetId: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const fetchReviews = useCallback(() => {
    fetch(
      `/api/reviews?target_type=${targetType}&target_id=${targetId}&sort=${sortBy}`
    )
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => {});
  }, [targetType, targetId, sortBy]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          rating,
          comment: comment || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit review");
      } else {
        setShowForm(false);
        setRating(0);
        setComment("");
        fetchReviews();
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (reviewId: string, vote: "helpful" | "not_helpful") => {
    try {
      const res = await fetch("/api/reviews/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id: reviewId, vote }),
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch {
      // silent fail
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="mt-6 border-t border-border pt-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Community Reviews
          </span>
          {avgRating && (
            <span className="text-xs text-[#fbbf24]">
              ★ {avgRating} ({reviews.length})
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg border border-border px-3 py-1 text-xs text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
        >
          {showForm ? "Cancel" : "Write a review"}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-4 rounded-[10px] border border-border bg-card p-4">
          <div className="mb-3">
            <span className="mb-1.5 block text-xs text-text-muted">
              Your rating
            </span>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience... (optional)"
            rows={2}
            className="mb-3 w-full resize-none rounded-lg border border-border bg-void px-3 py-2 font-[inherit] text-sm text-text-primary"
          />
          {error && (
            <p className="mb-2 text-xs text-sec-red">{error}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="rounded-lg bg-accent-purple/20 px-4 py-1.5 text-xs font-semibold text-accent-violet transition-colors hover:bg-accent-purple/30 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* Sort Options */}
      {reviews.length > 1 && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[11px] text-text-muted">Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`rounded-md px-2 py-0.5 text-[11px] transition-colors ${
                sortBy === opt.value
                  ? "bg-accent-purple/15 text-accent-violet"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Review List */}
      {reviews.length === 0 ? (
        <p className="text-xs text-text-muted">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-[10px] border border-border bg-card px-4 py-3"
            >
              <div className="mb-1 flex items-center justify-between">
                <StarRating value={review.rating} readonly />
                <span className="text-[11px] text-text-muted">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="mb-2 text-[13px] text-text-secondary">
                  {review.comment}
                </p>
              )}
              {/* Vote Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleVote(review.id, "helpful")}
                  className={`flex items-center gap-1 text-[11px] transition-colors ${
                    review.user_vote === "helpful"
                      ? "text-accent-violet"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <span>&#9650;</span> Helpful
                  {review.helpful_count > 0 && (
                    <span>({review.helpful_count})</span>
                  )}
                </button>
                <button
                  onClick={() => handleVote(review.id, "not_helpful")}
                  className={`flex items-center gap-1 text-[11px] transition-colors ${
                    review.user_vote === "not_helpful"
                      ? "text-sec-red"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <span>&#9660;</span> Not helpful
                  {review.not_helpful_count > 0 && (
                    <span>({review.not_helpful_count})</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
