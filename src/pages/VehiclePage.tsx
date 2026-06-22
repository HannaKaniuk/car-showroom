import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchVehicleById } from '../api/vehicles';
import { CommentForm } from '../components/CommentForm';
import { CommentList } from '../components/CommentList';
import { VehicleDetails } from '../components/VehicleDetails';
import { addLocalComment, getLocalComments } from '../utils/commentsStorage';
import { mergeReviews } from '../utils/reviews';
import type { LocalReview, Vehicle } from '../types/vehicle';

function InvalidVehicleMessage() {
  return (
    <div className="error-page">
      <p className="status-message status-message--error" role="alert">
        Невірний ідентифікатор автомобіля
      </p>
      <Link to="/" className="btn btn--secondary">
        Повернутися до каталогу
      </Link>
    </div>
  );
}

interface VehicleContentProps {
  id: number;
  onRetry: () => void;
}

function VehicleContent({ id, onRetry }: VehicleContentProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [localReviews, setLocalReviews] = useState<LocalReview[]>(() => getLocalComments(id));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchVehicleById(id, controller.signal)
      .then((data) => {
        if (data.category !== 'vehicle') {
          throw new Error('Not a vehicle');
        }
        setVehicle(data);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError('Автомобіль не знайдено');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  const allReviews = useMemo(() => {
    if (!vehicle) return localReviews;
    return mergeReviews(localReviews, vehicle.reviews);
  }, [vehicle, localReviews]);

  const handleAddComment = useCallback(
    (data: { reviewerName: string; comment: string; rating: number }) => {
      const newReview = addLocalComment(id, {
        ...data,
        date: new Date().toISOString(),
      });
      setLocalReviews((prev) => [newReview, ...prev]);
    },
    [id],
  );

  if (loading) {
    return (
      <div className="loader" role="status">
        <span className="loader__spinner" aria-hidden="true" />
        Завантаження автомобіля...
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="error-page">
        <p className="status-message status-message--error" role="alert">
          {error ?? 'Автомобіль не знайдено'}
        </p>
        <div className="error-page__actions">
          <button type="button" className="btn btn--secondary" onClick={onRetry}>
            Спробувати знову
          </button>
          <Link to="/" className="btn btn--secondary">
            Повернутися до каталогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="breadcrumb" aria-label="Навігація">
        <Link to="/">Каталог</Link>
        <span aria-hidden="true"> / </span>
        <span>{vehicle.title}</span>
      </nav>

      <VehicleDetails vehicle={vehicle} />

      <section className="reviews-section" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading">Відгуки ({allReviews.length})</h2>

        <CommentForm onSubmit={handleAddComment} />
        <CommentList reviews={allReviews} />
      </section>
    </>
  );
}

export function VehiclePage() {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [fetchKey, setFetchKey] = useState(0);
  const id = Number(vehicleId);

  if (!vehicleId || Number.isNaN(id)) {
    return <InvalidVehicleMessage />;
  }

  return (
    <VehicleContent
      key={`${id}-${fetchKey}`}
      id={id}
      onRetry={() => setFetchKey((k) => k + 1)}
    />
  );
}
