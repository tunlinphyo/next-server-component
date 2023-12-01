'use server'

import { getPayemnts } from "./payments.actions"
import { PayemntTable } from "./payments.client"

export async function PayemntList() {
    const payments = await getPayemnts()
    return (
        <PayemntTable payments={payments} />
    )
}