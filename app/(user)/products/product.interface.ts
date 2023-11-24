import { Category, Product, ProductCategory, ProductClass, ProductImage, Variant } from "@prisma/client"

export interface ProductClassWithVariants extends ProductClass {
    product?: Product;
    variant1?: Variant;
    variant2?: Variant;
}

export interface ProductWithPriceAndStock extends Product {
    minPrice: number;
    maxPrice: number;
    quantity: number;
    images: ProductImage[];
    productClasses: ProductClassWithVariants[];
}

export interface CategotyWithDetail extends ProductCategory {
    category: Category;
}

export interface ProductDetail extends ProductWithPriceAndStock {
    categories?: CategotyWithDetail[];
    variant1?: Variant;
    variant2?: Variant;
}

export interface FavouriteFormData {
    productId: number;
    customerId: number;
    is: boolean;
    pathname: string;
}
