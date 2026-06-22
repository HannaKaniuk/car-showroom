import type { LocalReview, Review } from '../types/vehicle';

export type DisplayReview = Review & { id?: string; local?: boolean };

export function mergeReviews(
  localReviews: LocalReview[],
  apiReviews: Review[],
): DisplayReview[] {
  return [...localReviews, ...apiReviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getReviewKey(review: DisplayReview, index: number): string {
  if (review.id) {
    return review.id;
  }

  return `api-${review.reviewerName}-${review.date}-${review.rating}-${index}`;
}
