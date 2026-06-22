import type { Vehicle } from '../types/vehicle';
import { formatPrice, getAvailabilityModifier, handleImageError } from '../utils/format';

interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const hasDiscount = vehicle.discountPercentage > 0;
  const statusClass = getAvailabilityModifier(vehicle.availabilityStatus);

  return (
    <section className="vehicle-details" aria-labelledby="vehicle-title">
      <div className="vehicle-details__gallery">
        {hasDiscount && (
          <span className="vehicle-details__badge">
            −{Math.round(vehicle.discountPercentage)}%
          </span>
        )}
        <img
          src={vehicle.images[0] ?? vehicle.thumbnail}
          alt={vehicle.title}
          className="vehicle-details__image"
          onError={handleImageError}
        />
      </div>

      <div className="vehicle-details__info">
        <div className="vehicle-details__head">
          <p className="vehicle-details__brand">{vehicle.brand}</p>
          <span className={`vehicle-details__status ${statusClass}`}>
            {vehicle.availabilityStatus}
          </span>
        </div>
        <h1 id="vehicle-title" className="vehicle-details__title">
          {vehicle.title}
        </h1>

        <div className="vehicle-details__highlights">
          <p className="vehicle-details__price">{formatPrice(vehicle.price)}</p>
          <p className="vehicle-details__rating" aria-label={`Рейтинг ${vehicle.rating} з 5`}>
            <span aria-hidden="true">★</span> {vehicle.rating.toFixed(1)} / 5
          </p>
        </div>

        <p className="vehicle-details__description">{vehicle.description}</p>

        <dl className="vehicle-details__specs">
          <div className="vehicle-details__spec">
            <dt>На складі</dt>
            <dd>{vehicle.stock} од.</dd>
          </div>
          <div className="vehicle-details__spec">
            <dt>Гарантія</dt>
            <dd>{vehicle.warrantyInformation}</dd>
          </div>
          <div className="vehicle-details__spec">
            <dt>Доставка</dt>
            <dd>{vehicle.shippingInformation}</dd>
          </div>
          <div className="vehicle-details__spec">
            <dt>Повернення</dt>
            <dd>{vehicle.returnPolicy}</dd>
          </div>
          <div className="vehicle-details__spec vehicle-details__spec--full">
            <dt>Теги</dt>
            <dd>
              <ul className="tag-list">
                {vehicle.tags.map((tag) => (
                  <li key={tag}>
                    <span className="tag">{tag}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
