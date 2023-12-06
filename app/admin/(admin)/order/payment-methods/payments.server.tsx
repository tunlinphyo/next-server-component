'use server'

import { getPayments } from "./payments.actions"
import { PayemntTable } from "./payments.client"

export async function PayemntList() {
    const payments = await getPayments()
    return (
        <PayemntTable payments={payments} />
    )
}