'use server'

import { getProducts } from "./products.actions"
import { ProductTable } from "./products.client"


export async function ProductList({ page, query }: { page: number; query: string }) {
    const products = await getProducts(page, query)
    return (
        <ProductTable products={products} />
    )
}