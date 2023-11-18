"use server"

import { getCategories, getHomeProduct } from "./home.actions"
import { Categories, ProductSlide } from "./home.client"

export async function ServerCategories() {
    const categories = await getCategories()

    return (
        <Categories categories={categories} />
    )
}

export async function ServerLatestProducts() {
    const products = await getHomeProduct()

    return (
        <ProductSlide products={products} />
    )
}