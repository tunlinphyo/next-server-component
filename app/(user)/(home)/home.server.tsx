"use server"

import styles from './home.module.css'
import { FavouriteSkeleton, Product } from "../products/products.client";
import { ServerFavourite } from "../products/products.server";
import { getUser } from "../user.actions";
import { getCategories, getHomeProduct } from "./home.actions"
import { Categories, ProductSlide } from "./home.client"
import { Suspense } from "react";
import { ProductWithPriceAndStock } from '../user/cart.interface';

export async function ServerCategories() {
    const categories = await getCategories()

    return (
        <Categories categories={categories} />
    )
}

export async function ServerLatestProducts() {
    const user = await getUser()
    const products = await getHomeProduct()

    return (
        <>
            <ProductSlide>
                {
                    products.map(item => (
                        <div className={styles.slideItem} key={item.id}>
                            <Product product={item} observeable>
                                <Suspense fallback={<FavouriteSkeleton />}>
                                    <ServerFavourite customerId={user?.id} productId={item.id} />
                                </Suspense>
                            </Product>
                        </div>
                    ))
                }
            </ProductSlide>
        </>
    )
}
