'use server'

import { PageSubTitle } from '@/components/user/utils/utils.client'
import { getProductDetail, getRelativeProducts } from "./product.actions"
import { ImageGallery } from "./gallery/gallery.client"
import { redirect } from "next/navigation"
import { ProductActions, ProductClassTable, ProductDetail, ProductTitle } from "./product.client"
import { getStockAndPrices } from "@/app/admin/(admin)/product/products/products.utils"
import { RelatedProdcutSkeleton } from './related/related-products.client'
import { Suspense } from 'react'
import { ServerRelatedProduct } from './related/related-product.server'

export async function ServerProduct({ id }: { id: number }) {
    const product = await getProductDetail(id)

    if (!product) redirect('/products')

    const { stockTotal, minPrice, maxPrice } = getStockAndPrices(product.productClasses)

    return (
        <>
            <ImageGallery images={product.images} />
            <ProductTitle title={product.name} />
            <ProductDetail product={product} minPrice={minPrice} maxPrice={maxPrice} />
            {
                product.productClasses[0].variant1Id && (
                    <ProductClassTable product={product} />
                )
            }
            <ProductActions productClass={product.productClasses} stock={stockTotal} />
            <Suspense fallback={
                <>
                    <PageSubTitle title="Related Ptoducts" />
                    <RelatedProdcutSkeleton />
                </>
            }>
                <ServerRelatedProduct id={id} />
            </Suspense>
        </>
    )
}
