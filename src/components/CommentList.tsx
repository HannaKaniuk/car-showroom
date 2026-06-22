import { getReviewKey, type DisplayReview } from '../utils/reviews';
import { formatDate } from '../utils/format';

interface CommentListProps {
  reviews: DisplayReview[];
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
            {review.local && <span className="comment__badge">Ваш коментар</span>}
          </footer>
        </li>
      ))}
    </ul>
  );
}
