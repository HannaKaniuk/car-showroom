import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="error-page">
      <h1 className="error-page__title">404</h1>
      <p className="status-message">Сторінку не знайдено</p>
      <Link to="/" className="btn btn--secondary">
        Повернутися до каталогу
      </Link>
    </div>
  );
}
