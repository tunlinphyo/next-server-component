'use server'

import { redirect } from "next/navigation"
import { getCategories, getProduct } from "../../products.actions"
import { ProductEditForm } from "./product-edit.client"
import { FormDates } from "@/components/admin/form/form.server"

export async function ProductEdit({ id }: { id: number }) {
    const product = await getProduct(id)
    console.log('PRODUCT', product)
    if (!product) redirect('/admin/product/products')
    const categories = await getCategories()
    return (
        <>
            <ProductEditForm
                product={product}
                categories={categories}
            />
            <FormDates createDate={product.createDate} updateDate={product.updateDate} />
        </>
    )
}