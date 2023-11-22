import { Product, ProductCategory, ProductClass, ProductImage, Variant } from "@prisma/client"

export interface FormCategoryType {
    id: number;
    name: string;
    children?: FormCategoryType[];
}

export interface ProductClassEdit extends ProductClass {
    product?: Product;
    variant1?: Variant;
    variant2?: Variant;
}

export interface ProductWithPriceAndStock extends Product {
    minPrice: number;
    maxPrice: number;
    quantity: number;
    images: ProductImage[];
    productClasses: ProductClass[];
}

export interface ProductEdit extends Product {
    variant1?: Variant;
    variant2?: Variant;
    images: ProductImage[];
    productClasses: ProductClassEdit[];
    categories: ProductCategory[];
}

export interface ClassEdit {
    productId: number
    variant1Id: number;
    variant2Id: number | undefined;
    price: number;
    quantity: number;
    isDelete: false;
}

export interface ClassCreate extends ClassEdit {
    id: number;
}
