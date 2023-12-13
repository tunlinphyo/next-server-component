'use server'

import { SummaryCard } from "@/components/admin/card/card.client"
import { CreditCardIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
import { getOrderCount, getPaymentMethodCount } from "./order.actions"

export async function PaymentSummaryCard() {
    const count = await getPaymentMethodCount()
    return (
        <SummaryCard
            title="Payment Methods"
            icon={<CreditCardIcon />}
            count={count}
            href="/admin/order/payment-methods"
        />
    )
}

export async function OrdersSummaryCard() {
    const count = await getOrderCount()
    return (
        <SummaryCard
            title="Orders"
            icon={<ShoppingCartIcon />}
            count={count}
            href="/admin/order/orders"
        />
    )
}
