'use server'

import { wait } from "@/libs/utils"
import { ProductCreateForm } from "./product-create.client"
import { getAllCategories } from "../products.actions"


export async function CreateProduct() {
    const categories = await getAllCategories()
    return (
        <ProductCreateForm categories={categories} />
    )
}

