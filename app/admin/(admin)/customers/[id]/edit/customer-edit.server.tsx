'use server'

import { redirect } from "next/navigation"
import { getCustomer, getStatus } from "../../customers.actions"
import { CustomerEditForm } from "./customer-edit.client"
import { FormDates } from "@/components/admin/form/form.server"


export async function CustomerEdit({ id }: { id: number }) {
    const customer = await getCustomer(id)
    const status = await getStatus()
    if (!customer) redirect('/admin/customers')
    return (
        <>
            <CustomerEditForm customer={customer} status={status} />
            <FormDates createDate={customer.createDate} updateDate={customer.updateDate} />
        </>
    )
}