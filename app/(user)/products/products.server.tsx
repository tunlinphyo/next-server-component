'use server'

import { FavouriteForm, Products } from "./products.client"
import { getFavourites, getProducts } from "./products.action"
import { Suspense } from "react";
import { wait } from "@/libs/utils";
import { getUser } from "../user.actions";

export async function ServerProducts({ page, query, categoryId }: { page: number; query: string; categoryId?: number }) {
    const user = await getUser()
    const products = await getProducts(page, query, categoryId)
    const productIds = products.map(item => item.id)

    return (
        <>
            <Products products={products} withFav={!!user} />
            <Suspense fallback={<></>}>
                <ServerFavourite customerId={user?.id} productIds={productIds} />
            </Suspense>
        </>
    )
}

export async function ServerFavourite({ customerId, productIds }: { customerId?: number, productIds: number[]; }) {
    if (!customerId) return null
    await wait()
    const customerFavourite = await getFavourites(customerId, productIds)
    const favourites = productIds.map(productId => ({
        productId,
        customerId,
        is: !!customerFavourite.find(item => item == productId),
    }))
    return (
        favourites.map(item => (
            <FavouriteForm key={item.productId} favourite={item} />
        ))
    )
}