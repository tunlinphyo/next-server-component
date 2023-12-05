"use server"

import { getUser } from "@/app/(user)/user.actions"
import { redirect } from "next/navigation"
import { getOrder, getCustomerPayemnts } from "../checkout.actions"
import { PaymentSlide } from "./payment.client"

export async function Payment({ orderId }: { orderId: number }) {
    const user = await getUser()
    if (!user) redirect('/')
    const order = await getOrder(orderId, user?.id)
    if (!order) redirect('cart')
    const payments = await getCustomerPayemnts(user.id)

    console.log(payments)
    return (
        <PaymentSlide orderId={orderId} customerId={user.id} payments={payments} />
    )
}