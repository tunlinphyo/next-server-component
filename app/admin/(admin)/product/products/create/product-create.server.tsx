'use server'

import { ProductCreateForm } from "./product-create.client"
import { getCategories } from "../products.actions"

export async function CreateProduct() {
    const categories = await getCategories()
    return (
        <ProductCreateForm categories={categories} />
    )
}

