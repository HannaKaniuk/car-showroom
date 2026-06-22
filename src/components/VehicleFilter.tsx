import { type FormEvent, useState } from 'react';
import {
  MAX_SEARCH_QUERY_LENGTH,
  validateSearchQuery,
} from '../utils/validation';

export interface VehicleFilters {
  query: string;
  brand: string;
  sortBy: 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc';
}

interface VehicleFilterProps {
  filters: VehicleFilters;
  brands: string[];
  onChange: (filters: VehicleFilters) => void;
}

export function VehicleFilter({ filters, brands, onChange }: VehicleFilterProps) {
  const [queryTouched, setQueryTouched] = useState(false);
  const queryError = validateSearchQuery(filters.query).query;

  function handleQueryChange(value: string) {
    onChange({ ...filters, query: value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setQueryTouched(true);
  }

  return (
    <form
      className="filter"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Фільтрація автомобілів"
    >
      <div className="filter__field">
        <label htmlFor="search">
          Пошук{' '}
          <span className="field-counter">
            {filters.query.length}/{MAX_SEARCH_QUERY_LENGTH}
          </span>
        </label>
        <input
          id="search"
          type="search"
          className={queryTouched && queryError ? "field-control--invalid" : undefined}
          placeholder="Модель, бренд, опис..."
          value={filters.query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onBlur={() => setQueryTouched(true)}
          {...(queryTouched && queryError
            ? { "aria-describedby": "search-error" }
            : {})}
        />
        {queryTouched && queryError && (
          <span id="search-error" className="field-error" role="alert">
            {queryError}
          </span>
        )}
      </div>

      <div className="filter__field">
        <label htmlFor="brand">Бренд</label>
        <select
          id="brand"
          value={filters.brand}
          onChange={(e) => onChange({ ...filters, brand: e.target.value })}
        >
          <option value="">Усі бренди</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="filter__field">
        <label htmlFor="sort">Сортування</label>
        <select
          id="sort"
          value={filters.sortBy}
          onChange={(e) =>
            onChange({
              ...filters,
              sortBy: e.target.value as VehicleFilters['sortBy'],
            })
          }
        >
          <option value="title-asc">За назвою (А–Я)</option>
          <option value="price-asc">Ціна: зростання</option>
          <option value="price-desc">Ціна: спадання</option>
          <option value="rating-desc">Рейтинг</option>
        </select>
      </div>
    </form>
  );
}
