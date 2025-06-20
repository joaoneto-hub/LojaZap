export interface ProductImage {
  url: string;
  path: string;
  alt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: string[];
  color?: string;
  size?: string;
  brand?: string;
  images?: ProductImage[];
  mainImage?: ProductImage;
  status: "active" | "inactive" | "out_of_stock";
  createdAt: Date;
  updatedAt: Date;
  userId: string; // ID do usuário que criou o produto
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: string[];
  color?: string;
  size?: string;
  brand?: string;
  images?: ProductImage[];
  mainImage?: ProductImage;
  status: "active" | "inactive" | "out_of_stock";
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface ProductFilters {
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}
