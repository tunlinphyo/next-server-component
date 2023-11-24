"use server"

import { ServerFavourite } from "../products/products.server";
import { getUser } from "../user.actions";
import { getCategories, getHomeProduct } from "./home.actions"
import { Categories, ProductSlide } from "./home.client"
import { Suspense } from "react";

export async function ServerCategories() {
    const categories = await getCategories()

    return (
        <Categories categories={categories} />
    )
}

export async function ServerLatestProducts() {
    const user = await getUser()
    const products = await getHomeProduct()
    const productIds = products.map(item => item.id)

    return (
        <>
            <ProductSlide products={products} withFav={!!user} />
            <Suspense fallback={<></>}>
                <ServerFavourite customerId={user?.id} productIds={productIds} />
            </Suspense>
        </>
    )
}