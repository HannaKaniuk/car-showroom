import { type FormEvent, useState } from "react";
import {
  MAX_COMMENT_LENGTH,
  MAX_NAME_LENGTH,
  hasErrors,
  validateCommentForm,
} from "../utils/validation";

interface CommentFormProps {
  onSubmit: (data: {
    reviewerName: string;
    comment: string;
    rating: number;
  }) => void;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [reviewerName, setReviewerName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [errors, setErrors] = useState<ReturnType<typeof validateCommentForm>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);

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

    setReviewerName("");
    setComment("");
    setRating("");
    setErrors({});
    setSubmitted(false);
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit} noValidate>
      <h3 className="comment-form__title">Додати коментар</h3>

      <div className="comment-form__field">
        <label htmlFor="reviewerName">Ваше ім&apos;я</label>
        <input
          id="reviewerName"
          type="text"
          className={submitted && errors.reviewerName ? "field-control--invalid" : undefined}
          value={reviewerName}
          maxLength={MAX_NAME_LENGTH}
          onChange={(e) => setReviewerName(e.target.value)}
          {...(submitted && errors.reviewerName
            ? { "aria-describedby": "name-error" }
            : {})}
        />
        {submitted && errors.reviewerName && (
          <span id="name-error" className="field-error" role="alert">
            {errors.reviewerName}
          </span>
        )}
      </div>

      <div className="comment-form__field">
        <label htmlFor="rating">Оцінка</label>
        <select
          id="rating"
          className={submitted && errors.rating ? "field-control--invalid" : undefined}
          value={rating}
          onChange={(e) =>
            setRating(e.target.value === "" ? "" : Number(e.target.value))
          }
          {...(submitted && errors.rating
            ? { "aria-describedby": "rating-error" }
            : {})}
        >
          <option value="">Оберіть оцінку</option>
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} — {"★".repeat(value)}
            </option>
          ))}
        </select>
        {submitted && errors.rating && (
          <span id="rating-error" className="field-error" role="alert">
            {errors.rating}
          </span>
        )}
      </div>

      <div className="comment-form__field">
        <label htmlFor="comment">
          Коментар{" "}
          <span className="field-counter">
            {comment.length}/{MAX_COMMENT_LENGTH}
          </span>
        </label>
        <textarea
          id="comment"
          className={submitted && errors.comment ? "field-control--invalid" : undefined}
          rows={4}
          value={comment}
          maxLength={MAX_COMMENT_LENGTH}
          onChange={(e) => setComment(e.target.value)}
          {...(submitted && errors.comment
            ? { "aria-describedby": "comment-error" }
            : {})}
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
