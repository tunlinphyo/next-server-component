'use server'

import { getZodErrors } from "@/libs/utils"
import { CustomerPaymentSchema } from "./customer-payemnt.schema"
import prisma from "@/libs/prisma"
import { encryptCookieValue } from "@/auth"
import { revalidatePath } from "next/cache"

export async function onCustomerPayment(prevState: any, formData: FormData): Promise<Record<string, string>> {

    const result = CustomerPaymentSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        console.log(getZodErrors(result.error.issues))
        return getZodErrors(result.error.issues)
    }

    const cardData = encryptCookieValue(JSON.stringify(result.data))
    const customerPayemntId = formData.get('customerPayemntId')

    if (customerPayemntId) {
        const payment = await prisma.customerPayment.update({
            where: { id: Number(customerPayemntId) },
            data: {
                cardData
            }
        })
        console.log(payment)

    } else {
        const payment = await prisma.customerPayment.create({
            data: {
                customerId: result.data.customerId,
                paymentId: result.data.paymentId,
                cardData
            }
        })
        console.log(payment)
    }


    const orderId = formData.get('orderId')
    revalidatePath(`/cart/${orderId}/payment`)

    return { back: 'go-back', message: 'Success' }
}