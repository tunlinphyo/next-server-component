'use server'

import { getStatus } from "../customers.actions"
import { CustomerCreateForm } from "./customer-create.client"

export async function CustomerCreate() {
    const status = await getStatus()
    return (
        <CustomerCreateForm status={status} />
    )
}