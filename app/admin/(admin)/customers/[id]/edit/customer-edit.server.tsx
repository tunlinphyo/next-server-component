'use server'

import { redirect } from "next/navigation"
import { getCustomer } from "../../customers.actions"
import { CustomerEditForm } from "./customer-edit.client"
import { FormDates } from "@/components/admin/form/form.client"


export async function CustomerEdit({ id }: { id: number }) {
    const customer = await getCustomer(id)
    if (!customer) redirect('/admin/customers')
    return (
        <>
            <CustomerEditForm customer={customer} />
            <FormDates createDate={customer.createDate} updateDate={customer.updateDate} />
        </>
    )
}