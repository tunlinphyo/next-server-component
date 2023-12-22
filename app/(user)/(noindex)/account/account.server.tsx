'use server'

import { redirect } from "next/navigation"
import { getUser } from "../../user.actions"
import { FavouriteSkeleton, LogoutForm, MoreButton, OrderItem, UserDetail } from "./account.client"
import { PageSubTitle, PageTitle, TextSkeleton } from "@/components/user/utils/utils.client"
import { getCustomerAddress, getFavouriteProducts, getOrders } from "./account.actions"
import { Suspense } from "react"
import { RemoveFavouriteForm } from "./[id]/favourites/favourites.client"
import { formatAddress } from "../../user/user.utils"
import { Product } from "../../products/products.client"
import { Slide, SlideItem } from "@/components/user/slide/slide.client"

export async function ServerLogoutForm() {
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
                    <FavouriteSkeleton />
                </>
            }>
                <ServerFavourites customerId={user.id} />
            </Suspense>
            <Suspense fallback={
                <>
                    <PageSubTitle title="Orders" />
                    <FavouriteSkeleton />
                </>
            }>
                <ServerOrders customerId={user.id} />
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
            <Slide id="favourites" end={<MoreButton id={customerId} name="favourites" />}>
                {
                    products.map((item) => (
                        <SlideItem key={item.id}>
                            <Product product={item} observeable>
                                <Suspense fallback={<FavouriteSkeleton />}>
                                    <RemoveFavouriteForm customerId={customerId} productId={item.id} />
                                </Suspense>
                            </Product>
                        </SlideItem>
                    ))
                }
            </Slide>
        </>
    )
}

export async function ServerOrders({ customerId }: { customerId: number }) {
    const orders = await getOrders(customerId)
    if (!orders.length) return <></>
    console.log('ORDERS', orders)
    return (
        <>
            <PageSubTitle title="Orders" />
            <Slide id="orders" end={<MoreButton id={customerId} name="orders" />}>
                {
                    orders.map(order => (
                        <SlideItem key={order.id}>
                            <OrderItem order={order} />
                        </SlideItem>
                    ))
                }
            </Slide>
        </>
    )
}