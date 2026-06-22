import type { Vehicle } from '../types/vehicle';
import { VehicleCard } from './VehicleCard';

interface VehicleListProps {
  vehicles: Vehicle[];
}

export function VehicleList({ vehicles }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <p className="empty-state" role="status">
        Автомобілів за вашим запитом не знайдено.
      </p>
    );
  }

  return (
    <ul className="vehicle-grid">
      {vehicles.map((vehicle) => (
        <li key={vehicle.id}>
          <VehicleCard vehicle={vehicle} />
        </li>
      ))}
    </ul>
  );
}
