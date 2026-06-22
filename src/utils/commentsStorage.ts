import type { LocalReview } from '../types/vehicle';

const STORAGE_KEY = 'car-showroom-comments';

type CommentsMap = Record<string, LocalReview[]>;

function readAll(): CommentsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data: CommentsMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLocalComments(vehicleId: number): LocalReview[] {
  return readAll()[String(vehicleId)] ?? [];
}

export function addLocalComment(
  vehicleId: number,
  review: Omit<LocalReview, 'id' | 'local'>,
): LocalReview {
  const all = readAll();
  const key = String(vehicleId);
  const newReview: LocalReview = {
    ...review,
    id: crypto.randomUUID(),
    local: true,
  };

  all[key] = [newReview, ...(all[key] ?? [])];
  writeAll(all);

  return newReview;
}
