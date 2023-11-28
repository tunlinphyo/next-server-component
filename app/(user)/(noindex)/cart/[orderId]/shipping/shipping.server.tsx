"use server"

import { getUser } from "@/app/(user)/user.actions"
import { getCart } from "@/app/(user)/user/cart.server"
import { redirect } from "next/navigation"
import { getOrder } from "../checkout.actions"
import { ShippingForm } from "./shipping.client"

export async function ServerShipping({ orderId }: { orderId: number }) {
    const user = await getUser()
    if (!user) redirect("/cart")
    const order = await getOrder(orderId)
    if (!order) redirect('cart')

    return (
        <ShippingForm order={order} customer={user} />
    )
}