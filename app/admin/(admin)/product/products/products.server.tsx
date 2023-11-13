'use server'

import { getProducts } from "./products.actions"
import { ProductTable } from "./products.client"


export async function ProductList({ page }: { page: number }) {
    const products = await getProducts(page)
    return (
        <ProductTable products={products} />
    )
}