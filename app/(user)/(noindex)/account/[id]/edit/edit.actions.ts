'use server'

import prisma from "@/libs/prisma"
import { CustomerEditSchema } from "./edit.schema"
import { getZodErrors } from "@/libs/utils"
import { revalidatePath } from "next/cache"

export async function getCustomerDetail(customerId: number) {
    return await prisma.customer.findUnique({
        where: { id: customerId },
        include: {
            status: true,
            address: {
                where: { isDefault: true, isDelete: false }
            }
        }
    })
}

export async function onCustomerEdit(prevState: any, formData: FormData): Promise<Record<string, string>> {
    const result = CustomerEditSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    console.log('DATA_________', result.data)
    const tResult = await prisma.$transaction(async (prisma) => {
        const customer = await prisma.customer.update({
            where: { id: result.data.customerId },
            data: {
                name: result.data.name
            }
        })
        
        const oldAddress = await prisma.customerAddress.findFirst({
            where: { customerId: result.data.customerId, isDefault: true }
        })
        const addrData = {
            customerId: result.data.customerId,
            address: result.data.address,
            city: result.data.city,
            state: result.data.state,
            country: result.data.country,
            isDefault: true
        }
        let addrResult: any;
        if (oldAddress) {
            addrResult = await prisma.customerAddress.update({
                where: { id: oldAddress.id },
                data: addrData
            })
        } else {
            addrResult = await prisma.customerAddress.create({
                data: addrData
            })
        }
        return { customer, addrResult }
    })

    console.log('CUSTOMER_UPDATE______', tResult)

    revalidatePath('/account')
    revalidatePath(`/account/${tResult.customer.id}/edit`)
    return { message: 'Success' }
}