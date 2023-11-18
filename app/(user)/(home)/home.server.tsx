"use server"

import { getHomeProduct } from "./home.actions"
import { ProductSlide } from "./home.client"

export async function ServerLatestProducts() {
    const products = await getHomeProduct()

    console.log(products)

    return (
        <ProductSlide products={products} />
    )
}