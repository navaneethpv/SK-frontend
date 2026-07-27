import type { IBrand } from './brand';



export interface IProductImage {
  id: number;
  product: number;
  image: string;
  type: string | null;
}

export interface IProductDetail {
  id: number;
  product: number;
  batch_lot: boolean;
  is_ecommerce_product: boolean;
  open_price: boolean;
  product_ref_product?: number | null;
}

export interface IProduct {
  id: number;
  alias: string;         // Used as product name / label
  description: string;   // Full description
  sdescription: string;  // Short description
  price: string;         // decimal price from Django
  discount: string;      // decimal discount from Django
  selling_price: number; // dynamically computed (price - discount)
  max_stock: number;
  min_stock: number;
  slug: string;
  points?: string | null;
  details?: string | null;
  icon?: string | null;   // Main image URL
  video?: string | null;
  cost: string;
  base_uom: number;
  product_group: number;
  is_active: boolean;
  tax?: number | null;
  brand?: number | IBrand | null;
  vendor?: number | null;
  is_batch: boolean;
  is_ecommerce_product: boolean;

  // Custom properties from serializers/models
  rating: number;
  review_count: number;
  img?: IProductImage[];
  product_details?: IProductDetail[];
}
