import type { SyntheticEvent } from 'react';
import { IMAGE_PLACEHOLDER } from '../constants';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export function getAvailabilityModifier(status: string): string {
  const lower = status.toLowerCase();
  if (lower.includes('out')) return 'vehicle-details__status--out';
  if (lower.includes('low')) return 'vehicle-details__status--low';
  return 'vehicle-details__status--in';
}

export function handleImageError(event: SyntheticEvent<HTMLImageElement>): void {
  event.currentTarget.src = IMAGE_PLACEHOLDER;
}
