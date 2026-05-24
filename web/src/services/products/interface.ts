import { Product, Category } from "./types";

export interface ProductFilters {
    categorySlug?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    specs?: Record<string, string | string[]>;  // Support multiple values for same spec
}

export interface PaginatedResult<T> {
    items: T[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
}

/**
 * Attribute for catalog filters
 */
export interface Attribute {
    id: string
    name: string
    slug: string
    type: string
    options: string[]
    categories: string[]
}

export interface IProductService {
    getAllProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<Product | null>;
    getProductBySlug(slug: string, lang?: string): Promise<Product | null>;
    getFeaturedProducts(): Promise<Product[]>;
    getProducts(filters?: ProductFilters, page?: number, perPage?: number): Promise<PaginatedResult<Product>>;
    getCategories(): Promise<Category[]>;
    getCategoryBySlug(slug: string): Promise<Category | null>;
    getAttributes(categoryId?: string): Promise<Attribute[]>;
}
