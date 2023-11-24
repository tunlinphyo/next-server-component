'use server'

import { getCustomers } from "./customers.actions"
import { CustomerTable } from "./customers.client"

export async function CustomerList({ page, query }: { page: number; query: string }) {
    const customers = await getCustomers(page, query)
    return (
        <CustomerTable customers={customers} />
    )
}