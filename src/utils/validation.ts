export const MAX_NAME_LENGTH = 50;
export const MAX_COMMENT_LENGTH = 500;
export const MAX_SEARCH_QUERY_LENGTH = 100;

export interface FieldErrors {
  reviewerName?: string;
  comment?: string;
  rating?: string;
}

export function validateCommentForm(
  reviewerName: string,
  comment: string,
  rating: number | '',
): FieldErrors {
  const errors: FieldErrors = {};

  const trimmedName = reviewerName.trim();
  const trimmedComment = comment.trim();

  if (!trimmedName) {
    errors.reviewerName = "Ім'я обов'язкове";
  } else if (trimmedName.length > MAX_NAME_LENGTH) {
    errors.reviewerName = `Максимум ${MAX_NAME_LENGTH} символів`;
  }

  if (!trimmedComment) {
    errors.comment = "Коментар обов'язковий";
  } else if (trimmedComment.length > MAX_COMMENT_LENGTH) {
    errors.comment = `Максимум ${MAX_COMMENT_LENGTH} символів`;
  }

  if (rating === '' || rating < 1 || rating > 5) {
    errors.rating = 'Оберіть оцінку від 1 до 5';
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
