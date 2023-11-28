'use server'

import { redirect } from "next/navigation"
import { getUser } from "../../user.actions"
import { LogoutForm, MoreButton, UserDetail } from "./account.client"
import { PageSubTitle, PageTitle, TextSkeleton } from "@/components/user/utils/utils.client"
import { wait } from "@/libs/utils"
import { getCustomerAddress, getFavouriteProducts } from "./account.actions"
import { Suspense } from "react"
import { RelatedProdcutSkeleton, RelatedProducts, SlideItem } from "../../products/[id]/related/related-products.client"
import { RemoveFavouriteForm } from "./[id]/favourites/favourites.client"
import { formatAddress } from "../../user/user.utils"
import { FavouriteSkeleton, Product } from "../../products/products.client"

export async function ServerLogoutForm() {
    // await wait(3000)
    const user = await getUser()
    if (!user) redirect('/')

    return (
        <>
            <PageTitle title={user.name} />
            <UserDetail user={user}>
                <Suspense fallback={<TextSkeleton width={200} />}>
                    <ServerAddress customerId={user.id} />
                </Suspense>
            </UserDetail>
            <Suspense fallback={
                <>
                    <PageSubTitle title="Favourites" />
                    <RelatedProdcutSkeleton />
                </>
            }>
                <ServerFavourites customerId={user.id} />
            </Suspense>
            <LogoutForm />
        </>
    )
}

export async function ServerAddress({ customerId }: { customerId: number }) {
    const address = await getCustomerAddress(customerId)
    console.log(address)
    if (!address) return <>No address.</>
    return (
        <>{ formatAddress(address) }</>
    )
}

export async function ServerFavourites({ customerId }: { customerId: number }) {
    const products = await getFavouriteProducts(customerId)
    if (!products.length) return <></>
    return (
        <>
            <PageSubTitle title="Favourites" />
            <RelatedProducts id={customerId} more={<MoreButton id={customerId} />}>
                {
                    products.map((item) => (
                        <SlideItem key={item.id}>
                            <Product product={item}>
                                <Suspense fallback={<FavouriteSkeleton />}>
                                    <RemoveFavouriteForm customerId={customerId} productId={item.id} />
                                </Suspense>
                            </Product>
                        </SlideItem>
                    ))
                }
            </RelatedProducts>
        </>
    )
}