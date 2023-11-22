'use server'

import { redirect } from "next/navigation"
import { getProduct } from "../../products.actions"
import { ClassCreateEditForm, ClassDeleteForm, VariantSelectForm } from "./product-class.client"
import { getVariants } from "../../product-class.actions"

export async function VariantSelect({ id }: { id: number }) {
    const product = await getProduct(id)
    if (!product) redirect(`/admin/product/products/${id}/edit`)

    if (!product?.variant1Id) {
        const variants = await getVariants()
        return (
            <VariantSelectForm id={id} variants={variants} />
        )
    }
    const [ variant1, variant2 ] = await Promise.all([
        getVariants(product.variant1Id),
        product.variant2Id ? getVariants(product.variant2Id) : undefined,
    ])

    console.log("TEST_DATA", product)

    return (
        <>
            <ClassDeleteForm id={product.id} />
            <ClassCreateEditForm
                product={product}
                variant1={variant1}
                variant2={variant2}
            />
        </>
    )
}