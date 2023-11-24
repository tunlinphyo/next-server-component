'use server'

import { Products } from "./products.client"
import { getProducts } from "./products.action"

export async function ServerProducts({ page, query, categoryId }: { page: number; query: string; categoryId?: number }) {
    const products = await getProducts(page, query, categoryId)

    return (
        <Products products={products} />
    )
}