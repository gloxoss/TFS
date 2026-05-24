"use server";

import { productService } from "@/services";
import { Product } from "@/services/products/types";

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
    try {
        const result = await productService().getProducts({
            categorySlug,
            isAvailable: true
        }, 1, 50); // Fetch up to 50 items

        return result.items;
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return [];
    }
}
