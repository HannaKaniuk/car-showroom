import type { Vehicle, VehiclesResponse } from '../types/vehicle';

const BASE_URL = 'https://dummyjson.com';

export async function fetchVehicles(): Promise<Vehicle[]> {
  const response = await fetch(`${BASE_URL}/products/category/vehicle`);

  if (!response.ok) {
    throw new Error('Failed to load vehicles');
  }

  const data: VehiclesResponse = await response.json();
  return data.products;
}

export async function fetchVehicleById(id: number): Promise<Vehicle> {
  const response = await fetch(`${BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error('Vehicle not found');
  }

  return response.json();
}
