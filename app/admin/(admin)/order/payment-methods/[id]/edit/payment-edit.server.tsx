'use server'

import { redirect } from "next/navigation"
import { getPayment } from "../../payments.actions"
import { PaymentEditForm } from "./payment-edit.client"

export async function PayemntEdit({ id }: { id: number }) {
    const payment = await getPayment(id)
    if (!payment) redirect('/admin/order/payment-methods')

    return (
        <PaymentEditForm payment={payment} />
    )
}