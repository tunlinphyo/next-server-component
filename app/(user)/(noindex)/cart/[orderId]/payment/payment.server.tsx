"use server"

import { getUser } from "@/app/(user)/user.actions"
import { redirect } from "next/navigation"
import { getOrder } from "../checkout.actions"
import { PaymentForm } from "./payment.client"

export async function Payment({ orderId }: { orderId: number }) {
    const user = await getUser()
    if (!user) redirect('/')
    const order = await getOrder(orderId, user?.id)
    if (!order) redirect('cart')
    return (
        <PaymentForm order={order} customer={user} />
    )
}