import { Link } from 'react-router-dom';
import type { Vehicle } from '../types/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const hasDiscount = vehicle.discountPercentage > 0;

  return (
    <article className="vehicle-card">
      <Link to={`/vehicles/${vehicle.id}`} className="vehicle-card__link">
        <figure className="vehicle-card__image-wrap">
          {hasDiscount && (
            <span className="vehicle-card__badge">
              −{Math.round(vehicle.discountPercentage)}%
            </span>
          )}
          <img
            src={vehicle.thumbnail}
            alt={vehicle.title}
            className="vehicle-card__image"
            loading="lazy"
          />
        </figure>
        <div className="vehicle-card__body">
          <p className="vehicle-card__brand">{vehicle.brand}</p>
          <h2 className="vehicle-card__title">{vehicle.title}</h2>
          <div className="vehicle-card__meta">
            <p className="vehicle-card__price">{formatPrice(vehicle.price)}</p>
            <p className="vehicle-card__rating" aria-label={`Рейтинг ${vehicle.rating} з 5`}>
              <span aria-hidden="true">★</span> {vehicle.rating.toFixed(1)}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
