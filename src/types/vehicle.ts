export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail?: string;
}

export interface LocalReview extends Review {
  id: string;
  local: true;
}

export interface Vehicle {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  availabilityStatus: string;
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  reviews: Review[];
  images: string[];
  thumbnail: string;
}

export interface VehiclesResponse {
  products: Vehicle[];
  total: number;
  skip: number;
  limit: number;
}
