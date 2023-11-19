'use server'

import { PageSubTitle } from '@/components/user/utils/utils.client'
import { getProductClasses, getProductDetail, getRelativeProducts } from "./product.actions"
import { ImageGallery } from "./gallery/gallery.client"
import { redirect } from "next/navigation"
import { ProductActions, ProductClassTable, ProductDetail, ProductTitle } from "./product.client"
import { getStockAndPrices } from "@/app/admin/(admin)/product/products/products.utils"
import { RelatedProducts } from './related/related-products'
import { Suspense } from 'react'

export async function ServerProduct({ id }: { id: number }) {
    const [ product, classes ] = await Promise.all([
        getProductDetail(id),
        getProductClasses(id)
    ])

    if (!product) redirect('/products')

    const { stockTotal, minPrice, maxPrice } = getStockAndPrices(classes)

    console.log(product)
    console.log(classes)

    return (
        <>
            <ImageGallery images={product.images} />
            <ProductTitle title={product.name} />
            <ProductDetail product={product} minPrice={minPrice} maxPrice={maxPrice} />
            {
                classes[0].variant_1_id && (
                    <ProductClassTable product={product} productClass={classes} />
                )
            }
            <ProductActions productClass={classes} stock={stockTotal} />
            <PageSubTitle title="Related Ptoducts" />
            <Suspense fallback={<>LOADING..</>}>
                <ServerRelatedProduct id={id} />
            </Suspense>
        </>
    )
}

export async function ServerRelatedProduct({ id }: { id: number }) {
    const products = await getRelativeProducts(id)

    return (
        <RelatedProducts products={products} />
    )
}