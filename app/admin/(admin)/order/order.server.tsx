'use server'

import { SummaryCard } from "@/components/admin/card/card.client"
import { CreditCardIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"

export async function PaymentSummaryCard() {
    const count = 2
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
    const count = 2
    return (
        <SummaryCard
            title="Orders"
            icon={<ShoppingCartIcon />}
            count={count}
            href="/admin/order/orders"
        />
    )
}
