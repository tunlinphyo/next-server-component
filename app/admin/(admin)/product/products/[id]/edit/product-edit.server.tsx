'use server'

import { redirect } from "next/navigation"
import { getActiveClasses, getAllCategories, getProduct } from "../../products.actions"
import { ProductEditForm } from "./product-edit.client"

export async function ProductEdit({ id }: { id: number }) {
    const [product, classes] = await Promise.all([
        getProduct(id),
        getActiveClasses(id)
    ]) 
    if (!product) redirect('/admin/product/products')
    const categories = await getAllCategories()
    return (
        <ProductEditForm 
            product={product} 
            classes={classes}
            categories={categories} 
        />
    )
}