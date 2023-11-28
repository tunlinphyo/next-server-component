'use server'

import { redirect } from "next/navigation"
import { getCustomerDetail } from "./edit.actions"
import { EditForm } from "./edit.client"
import { wait } from "@/libs/utils"

export async function CustomerEdit({ id }: { id: number }) {
    // await wait(3000)
    const customer = await getCustomerDetail(id)

    if (!customer) {
        redirect('/login')
    }

    return (
        <EditForm customer={customer} />
    )
}