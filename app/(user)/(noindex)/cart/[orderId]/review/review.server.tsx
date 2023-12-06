'use server'

import { getUser } from "@/app/(user)/user.actions"
import { getCustomerPayment, getOrder, getOrderItems } from "../checkout.actions"
import { redirect } from "next/navigation"
import { CardData, OrderItems, ReviewForm } from "./review.client"
import { Suspense } from "react"

export async function Review({ orderId }: { orderId: number }) {
    const user = await getUser()
    if (!user) redirect('/')
    const order = await getOrder(orderId, user?.id)
    if (!order) redirect('/cart')

    return (
        <ReviewForm order={order} card={
            <Suspense fallback={<div>LOADING..</div>}>
                <ServerCard orderId={order.id} customerPaymentId={order.customerPaymentId} />
            </Suspense>
        }>
            <Suspense fallback={<div>LOADING..</div>}>
                <ServerOrderItems orderId={order.id} />
            </Suspense>
        </ReviewForm>
    )
}

export async function ServerOrderItems({ orderId }: { orderId: number }) {
    const orderItems = await getOrderItems(orderId)
    return (
        <OrderItems orderItems={orderItems} />
    )
}

export async function ServerCard({ orderId, customerPaymentId }: { orderId: number; customerPaymentId: number | null; }) {
    const customerPayment = await getCustomerPayment(customerPaymentId as number, true)
    return (
        <CardData orderId={orderId} customerPayment={customerPayment} />
    )
}