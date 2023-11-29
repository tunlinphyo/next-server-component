'use server'

import { getZodErrors } from "@/libs/utils"
import { AddressSchema } from "./address.schema"
import prisma from "@/libs/prisma"
import { revalidatePath } from "next/cache"

export async function onAddressEdit(prevState: any, formData: FormData): Promise<Record<string, string>> {
    const result = AddressSchema.safeParse(Object.fromEntries(formData))
    console.log('ADDRESS_DATA____', result)

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    let id = Number(formData.get('id'))

    if (id) {
        const address = await prisma.customerAddress.update({
            where: { id },
            data: {
                ...result.data,
                isDefault: false
            }
        })
    } else {
        const address = await prisma.customerAddress.create({
            data: {
                ...result.data,
                isDefault: false
            }
        })
        if (address) id = address.id
    }

    revalidatePath(`cart/${result.data.customerId}/shipping`)
    return { back: `go-back` }
}