"use server"

import { getUser } from "@/app/(user)/user.actions"
import { redirect } from "next/navigation"
import { getOrder, getCreditCardPayments, getCustomerPayment } from "../../checkout.actions"
import { PaymentForm } from "./customer-payment.client"
import { CustomerPaymentWithPayment } from "../../checkout.interface"


export async function CustomerPayment({ orderId, paymentId }: { orderId: string; paymentId: string }) {
    const user = await getUser()
    if (!user) redirect('/')
    let customerPayment: CustomerPaymentWithPayment | null = null
    if (paymentId != 'new') customerPayment = await getCustomerPayment(Number(paymentId))
    const payments = await getCreditCardPayments()
    return (
        <PaymentForm customerPayment={customerPayment} customerId={user.id} orderId={orderId} payments={payments} />
    )
}