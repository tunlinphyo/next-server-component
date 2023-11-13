'use server'

import { redirect } from "next/navigation"
import { getActiveClasses, getAllVariants, getProduct } from "../../products.actions"
import { ClassCreateEditForm, ClassDeleteForm, VariantSelectForm } from "./product-class.client"

export async function VariantSelect({ id }: { id: number }) {
    const product = await getProduct(id)
    if (!product) redirect(`/admin/product/products/${id}/edit`)

    if (!product?.variant_1_id) {
        const variants = await getAllVariants()
        return (
            <VariantSelectForm id={id} variants={variants} />
        )
    }
    const [ variant1, variant2, classes ] = await Promise.all([
        getAllVariants(product.variant_1_id),
        product.variant_2_id ? getAllVariants(product.variant_2_id) : undefined,
        getActiveClasses(id)
    ])

    console.log("TEST_DATA", product)

    return (
        <>
            <ClassDeleteForm id={product.id} />
            <ClassCreateEditForm 
                product={product}
                variant1={variant1}
                variant2={variant2}
                classes={classes}
            />
        </>
    )
}