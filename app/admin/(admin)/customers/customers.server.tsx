'use server'

import { getCustomers } from "./customers.actions"
import { CustomerTable } from "./customers.client"

export async function CustomerList({ page }: { page: number }) {
    const customers = await getCustomers(page)
    return (
        <CustomerTable customers={customers} />
    )
}