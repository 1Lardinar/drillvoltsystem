export interface ProductSpec {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  images: string[];
  specifications: ProductSpec[];
  datasheet?: string; // PDF URL
  tags: string[];
  featured: boolean;
  visible: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  category: string;
  price: string;
  images: string[];
  specifications: ProductSpec[];
  datasheet?: string;
  tags: string[];
  featured: boolean;
  visible: boolean;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}
