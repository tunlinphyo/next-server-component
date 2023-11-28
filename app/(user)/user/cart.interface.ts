import { Cart, CartItem, Product, ProductClass, ProductImage, Variant } from "@prisma/client";

export interface ProductWithPriceAndStock extends Product {
    quantity: number;
    images: ProductImage[];
    productClasses?: ProductClass[];
}

export interface ProductClassEdit extends ProductClass {
    product?: ProductWithPriceAndStock;
    variant1?: Variant;
    variant2?: Variant;
}

export interface CartItemWithDetail extends CartItem {
    product: ProductWithPriceAndStock;
    productClass: ProductClassEdit;
}

export interface CartWithItems extends Cart {
    cartItems: CartItemWithDetail[];
}

export interface CookieCartItem {
    id: number;
    quantity: number,
    product: ProductWithPriceAndStock,
    productClass: ProductClassEdit,
}

export interface CookieCartWithItems {
    cartItems: CookieCartItem[];
}