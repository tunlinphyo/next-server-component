'use server'

import { getUser } from '@/app/(user)/user.actions'
import { getRelativeProducts } from '../product.actions'
import { FavouriteSkeleton, Product } from '../../products.client'
import { Suspense } from 'react'
import { ServerFavourite } from '../../products.server'
import { Slide, SlideItem } from '@/components/user/slide/slide.client'
import { PageSubTitle } from '@/components/user/utils/utils.client'

export async function ServerRelatedProduct({ id }: { id: number }) {
    const user = await getUser()
    const products =  await getRelativeProducts(id)

    if (!products.length) return <></>

    return (
        <>
            <PageSubTitle title="Related Ptoducts" />
            <Slide id={id}>
                {
                    products.map((item) => (
                        <SlideItem key={item.id}>
                            <Product product={item} observeable>
                                <Suspense fallback={<FavouriteSkeleton />}>
                                    <ServerFavourite customerId={user?.id} productId={item.id} />
                                </Suspense>
                            </Product>
                        </SlideItem>
                    ))
                }
            </Slide>
        </>
    )
}