import { type FormEvent, useEffect, useState } from 'react';
import { CustomSelect, type SelectOption } from './CustomSelect';
import {
  MAX_COMMENT_LENGTH,
  MAX_NAME_LENGTH,
  type FieldErrors,
  hasErrors,
  validateCommentForm,
} from '../utils/validation';

interface CommentFormProps {
  onSubmit: (data: {
    reviewerName: string;
    comment: string;
    rating: number;
  }) => void;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [reviewerName, setReviewerName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number | ''>('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const ratingOptions: SelectOption<`${1 | 2 | 3 | 4 | 5}` | ''>[] = [
    { value: '', label: 'Оберіть оцінку' },
    { value: '5', label: '5 — ★★★★★' },
    { value: '4', label: '4 — ★★★★' },
    { value: '3', label: '3 — ★★★' },
    { value: '2', label: '2 — ★★' },
    { value: '1', label: '1 — ★' },
  ];

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(false), 4000);
    return () => window.clearTimeout(timer);
  }, [success]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setSuccess(false);

    const validationErrors = validateCommentForm(reviewerName, comment, rating);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    onSubmit({
      reviewerName: reviewerName.trim(),
      comment: comment.trim(),
      rating: rating as number,
    });

    setReviewerName('');
    setComment('');
    setRating('');
    setErrors({});
    setSubmitted(false);
    setSuccess(true);
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit} noValidate>
      <h3 className="comment-form__title">Додати коментар</h3>

      {success && (
        <p className="comment-form__success" role="status" aria-live="polite">
          Дякуємо за відгук!
        </p>
      )}

      <div className="comment-form__field">
        <label htmlFor="reviewerName">Ваше ім&apos;я</label>
        <input
          id="reviewerName"
          type="text"
          className={
            submitted && errors.reviewerName ? 'field-control--invalid' : undefined
          }
          value={reviewerName}
          maxLength={MAX_NAME_LENGTH}
          onChange={(e) => setReviewerName(e.target.value)}
          {...(submitted && errors.reviewerName
            ? { 'aria-describedby': 'name-error' }
            : {})}
        />
        {submitted && errors.reviewerName && (
          <span id="name-error" className="field-error" role="alert">
            {errors.reviewerName}
          </span>
        )}
      </div>

      <div className="comment-form__field">
        <CustomSelect
          id="rating"
          label="Оцінка"
          value={rating === '' ? '' : String(rating) as `${1 | 2 | 3 | 4 | 5}`}
          options={ratingOptions}
          invalid={submitted && !!errors.rating}
          describedBy={submitted && errors.rating ? 'rating-error' : undefined}
          onChange={(value) => setRating(value === '' ? '' : Number(value))}
        />
        {submitted && errors.rating && (
          <span id="rating-error" className="field-error" role="alert">
            {errors.rating}
          </span>
        )}
      </div>

      <div className="comment-form__field">
        <label htmlFor="comment">
          Коментар{' '}
          <span className="field-counter">
            {comment.length}/{MAX_COMMENT_LENGTH}
          </span>
        </label>
        <textarea
          id="comment"
          className={submitted && errors.comment ? 'field-control--invalid' : undefined}
          rows={4}
          value={comment}
          maxLength={MAX_COMMENT_LENGTH}
          onChange={(e) => setComment(e.target.value)}
          {...(submitted && errors.comment ? { 'aria-describedby': 'comment-error' } : {})}
        />
        {submitted && errors.comment && (
          <span id="comment-error" className="field-error" role="alert">
            {errors.comment}
          </span>
        )}
      </div>

      <button type="submit" className="btn btn--primary">
        Надіслати
      </button>
    </form>
  );
}
