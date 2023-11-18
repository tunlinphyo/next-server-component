'use server'

import { Products } from "./products.client"
import { getProducts } from "./products.action"

export async function ServerProducts({ page, query }: { page: number; query: string }) {
    const products = await getProducts(page, query)

    return (
        <Products products={products} />
    )
}