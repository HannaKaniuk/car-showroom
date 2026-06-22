import { useEffect, useMemo, useState } from 'react';
import { fetchVehicles } from '../api/vehicles';
import { VehicleFilter, type VehicleFilters } from '../components/VehicleFilter';
import { VehicleList } from '../components/VehicleList';
import type { Vehicle } from '../types/vehicle';

const defaultFilters: VehicleFilters = {
  query: '',
  brand: '',
  sortBy: 'title-asc',
};

function filterAndSort(vehicles: Vehicle[], filters: VehicleFilters): Vehicle[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = vehicles.filter((vehicle) => {
    const matchesBrand = !filters.brand || vehicle.brand === filters.brand;
    const matchesQuery =
      !query ||
      vehicle.title.toLowerCase().includes(query) ||
      vehicle.brand.toLowerCase().includes(query) ||
      vehicle.description.toLowerCase().includes(query);

    return matchesBrand && matchesQuery;
  });

  return filtered.toSorted((a, b) => {
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
}

interface VehicleCatalogProps {
  onRetry: () => void;
}

function VehicleCatalog({ onRetry }: VehicleCatalogProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filters, setFilters] = useState<VehicleFilters>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchVehicles(controller.signal)
      .then(setVehicles)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError('Не вдалося завантажити автомобілі');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
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
      <div className="error-page">
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Спробувати знову
        </button>
      </div>
    );
  }

  return (
    <>
      <VehicleFilter filters={filters} brands={brands} onChange={setFilters} />

      <p className="results-count" role="status">
        Знайдено: {filteredVehicles.length} з {vehicles.length}
      </p>

      <VehicleList vehicles={filteredVehicles} />
    </>
  );
}

export function HomePage() {
  const [fetchKey, setFetchKey] = useState(0);

  return (
    <>
      <header className="page-header">
        <h1>Каталог автомобілів</h1>
        <p>Оберіть модель для детальної інформації та відгуків</p>
      </header>

      <VehicleCatalog key={fetchKey} onRetry={() => setFetchKey((k) => k + 1)} />
    </>
  );
}
