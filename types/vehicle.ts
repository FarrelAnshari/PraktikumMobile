

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface VehicleItem {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku: string;
  weight: number;
  dimensions?: Dimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus: string;
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity: number;
  meta?: ProductMeta;
  images: string[];
  thumbnail: string;
}

export interface ApiResponse<T> {
  products: T;
  total: number;
  skip: number;
  limit: number;
}

