import { useEffect, useMemo, useState } from 'react';
import { fetchVehicles } from '../api/vehicles';
import { VehicleFilter, type VehicleFilters } from '../components/VehicleFilter';
import { VehicleList } from '../components/VehicleList';
import type { Vehicle } from '../types/vehicle';
import { validateSearchQuery } from '../utils/validation';

const defaultFilters: VehicleFilters = {
  query: '',
  brand: '',
  sortBy: 'title-asc',
};

function filterAndSort(vehicles: Vehicle[], filters: VehicleFilters): Vehicle[] {
  const hasQueryError = !!validateSearchQuery(filters.query).query;
  const query = hasQueryError ? '' : filters.query.trim().toLowerCase();

  let result = vehicles.filter((vehicle) => {
    const matchesBrand = !filters.brand || vehicle.brand === filters.brand;
    const matchesQuery =
      !query ||
      vehicle.title.toLowerCase().includes(query) ||
      vehicle.brand.toLowerCase().includes(query) ||
      vehicle.description.toLowerCase().includes(query);

    return matchesBrand && matchesQuery;
  });

  result = [...result].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-desc':
        return b.rating - a.rating;
      case 'title-asc':
      default:
        return a.title.localeCompare(b.title, 'uk');
    }
  });

  return result;
}

export function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filters, setFilters] = useState<VehicleFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles()
      .then(setVehicles)
      .catch(() => setError('Не вдалося завантажити автомобілі'))
      .finally(() => setLoading(false));
  }, []);

  const brands = useMemo(
    () => [...new Set(vehicles.map((v) => v.brand))].sort(),
    [vehicles],
  );

  const filteredVehicles = useMemo(
    () => filterAndSort(vehicles, filters),
    [vehicles, filters],
  );

  if (loading) {
    return (
      <div className="loader" role="status">
        <span className="loader__spinner" aria-hidden="true" />
        Завантаження каталогу...
      </div>
    );
  }

  if (error) {
    return (
      <p className="status-message status-message--error" role="alert">
        {error}
      </p>
    );
  }

  return (
    <>
      <header className="page-header">
        <h1>Каталог автомобілів</h1>
        <p>Оберіть модель для детальної інформації та відгуків</p>
      </header>

      <VehicleFilter filters={filters} brands={brands} onChange={setFilters} />

      <p className="results-count" role="status">
        Знайдено: {filteredVehicles.length} з {vehicles.length}
      </p>

      <VehicleList vehicles={filteredVehicles} />
    </>
  );
}
