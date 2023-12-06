"use server"

import { getUser } from "@/app/(user)/user.actions"
import { redirect } from "next/navigation"
import { getOrder, getCustomerPayemnts } from "../checkout.actions"
import { OrderSummaryCard, PaymentForm } from "./payment.client"
import { type Payment } from "@prisma/client"

export async function Payment({ orderId }: { orderId: number }) {
    const user = await getUser()
    if (!user) redirect('/')
    const order = await getOrder(orderId, user?.id)
    if (!order) redirect('/cart')
    const payments = await getCustomerPayemnts(user.id)

    return (
        <PaymentForm order={order} payments={payments} customerId={user.id}>
            <OrderSummaryCard order={order} />
        </PaymentForm>
    )
}