'use server'

import { Products } from "./products.client"
import { getProducts } from "./products.action"

export async function ServerProducts() {
    const products = await getProducts(1, '')

    console.log('PRODUCT', products[0])
    return (
        <Products products={products} />
    )
}