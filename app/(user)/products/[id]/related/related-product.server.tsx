'use server'

import { getUser } from '@/app/(user)/user.actions'
import { getRelativeProducts } from '../product.actions'
import { RelatedProducts, SlideItem } from './related-products.client'
import { FavouriteSkeleton, Product } from '../../products.client'
import { Suspense } from 'react'
import { ServerFavourite } from '../../products.server'

export async function ServerRelatedProduct({ id }: { id: number }) {
    const user = await getUser()
    const products =  await getRelativeProducts(id)

    return (
        <>
            <RelatedProducts id={id}>
                {
                    products.map((item) => (
                        <SlideItem key={item.id}>
                            <Product product={item}>
                                <Suspense fallback={<FavouriteSkeleton />}>
                                    <ServerFavourite customerId={user?.id} productId={item.id} />
                                </Suspense>
                            </Product>
                        </SlideItem>
                    ))
                }
            </RelatedProducts>
        </>
    )
}