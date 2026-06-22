import type { LocalReview } from '../types/vehicle';
import { getReviewKey, type DisplayReview } from '../utils/reviews';

interface CommentListProps {
  reviews: DisplayReview[];
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export function CommentList({ reviews }: CommentListProps) {
  if (reviews.length === 0) {
    return (
      <p className="empty-state" role="status">
        Поки що немає коментарів. Будьте першим!
      </p>
    );
  }

  return (
    <ul className="comment-list">
      {reviews.map((review, index) => (
        <li key={getReviewKey(review, index)} className="comment">
          <header className="comment__header">
            <strong className="comment__author">{review.reviewerName}</strong>
            <span className="comment__rating" aria-label={`Оцінка ${review.rating} з 5`}>
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </span>
          </header>
          <p className="comment__text">{review.comment}</p>
          <footer className="comment__footer">
            <time dateTime={review.date}>{formatDate(review.date)}</time>
            {(review as LocalReview).local && (
              <span className="comment__badge">Ваш коментар</span>
            )}
          </footer>
        </li>
      ))}
    </ul>
  );
}
