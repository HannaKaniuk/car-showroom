import {
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useState,
} from 'react';
import { CustomSelect, type SelectOption } from './CustomSelect';
import {
  MAX_SEARCH_QUERY_LENGTH,
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
  const [queryLimitError, setQueryLimitError] = useState(false);
  const brandOptions: SelectOption<string>[] = [
    { value: '', label: 'Усі бренди' },
    ...brands.map((brand) => ({ value: brand, label: brand })),
  ];
  const sortOptions: SelectOption<VehicleFilters['sortBy']>[] = [
    { value: 'title-asc', label: 'За назвою (А–Я)' },
    { value: 'price-asc', label: 'Ціна: зростання' },
    { value: 'price-desc', label: 'Ціна: спадання' },
    { value: 'rating-desc', label: 'Рейтинг' },
  ];

  function handleQueryChange(value: string) {
    if (value.length < MAX_SEARCH_QUERY_LENGTH) {
      setQueryLimitError(false);
    }
    onChange({ ...filters, query: value });
  }

  function handleQueryKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    const isPrintable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

    if (isPrintable && filters.query.length >= MAX_SEARCH_QUERY_LENGTH) {
      setQueryLimitError(true);
    }
  }

  function handleQueryPaste(e: ClipboardEvent<HTMLInputElement>) {
    const paste = e.clipboardData.getData('text');
    const input = e.currentTarget;
    const start = input.selectionStart ?? filters.query.length;
    const end = input.selectionEnd ?? filters.query.length;
    const next = `${filters.query.slice(0, start)}${paste}${filters.query.slice(end)}`;

    if (next.length > MAX_SEARCH_QUERY_LENGTH) {
      setQueryLimitError(true);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
          <span
            className={
              filters.query.length >= MAX_SEARCH_QUERY_LENGTH
                ? 'field-counter field-counter--limit'
                : 'field-counter'
            }
          >
            {filters.query.length}/{MAX_SEARCH_QUERY_LENGTH}
          </span>
        </label>
        <input
          id="search"
          type="search"
          className={queryLimitError ? 'field-control--invalid' : undefined}
          placeholder="Модель, бренд, опис..."
          value={filters.query}
          maxLength={MAX_SEARCH_QUERY_LENGTH}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleQueryKeyDown}
          onPaste={handleQueryPaste}
          {...(queryLimitError ? { 'aria-describedby': 'search-error' } : {})}
        />
        <p className="filter__field-message" aria-live="polite">
          {queryLimitError ? (
            <span
              id="search-error"
              className="field-error field-error--visible"
              role="alert"
            >
              Максимум {MAX_SEARCH_QUERY_LENGTH} символів
            </span>
          ) : null}
        </p>
      </div>

      <div className="filter__field">
        <CustomSelect
          id="brand"
          label="Бренд"
          value={filters.brand}
          options={brandOptions}
          onChange={(brand) => onChange({ ...filters, brand })}
        />
        <p className="filter__field-message" aria-hidden="true" />
      </div>

      <div className="filter__field">
        <CustomSelect
          id="sort"
          label="Сортування"
          value={filters.sortBy}
          options={sortOptions}
          onChange={(sortBy) => onChange({ ...filters, sortBy })}
        />
        <p className="filter__field-message" aria-hidden="true" />
      </div>
    </form>
  );
}
