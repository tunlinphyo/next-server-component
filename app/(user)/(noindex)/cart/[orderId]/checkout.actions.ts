'use server'

import prisma from "@/libs/prisma"
import { getZodErrors, isObjectEmpty, wait } from "@/libs/utils"
import { ShippingSchema } from "./checkout.schema"
import { redirect } from "next/navigation"
import { GenericObject } from "@/libs/definations"
import { OrderWithPaymentAndAddress } from "./checkout.interface"

export async function getOrder(orderId: number, customerId: number) {
    const order = await prisma.order.findUnique({
        where: { id: orderId, customerId },
        include: {
            address: true,
            orderPayment: true,
        }
    }) as OrderWithPaymentAndAddress

    return order
}

export async function getAllCustomerAddress(customerId: number) {
    return await prisma.customerAddress.findMany({
        where: { customerId }
    })
}

export async function onShipping(prevState: any, formData: FormData): Promise<Record<string, string>> {
    const orderId = Number(formData.get('orderId'))
    const customerId = Number(formData.get('customerId'))
    const countrycode = String(formData.get('countrycode'))
    if (!orderId) return { message: 'Order id is required' }

    const result = ShippingSchema.safeParse(Object.fromEntries(formData))

    let errors: Record<string, string> = {}
    if (!result.success) {
        errors = getZodErrors(result.error.issues)
    }
    if (!countrycode) {
        errors.phone = 'Country code is required'
    }
    if (!isObjectEmpty(errors)) return errors

    if (!result.success) return errors

    console.log('SHIPPING____', result.data)

    try {
        const order = await prisma.order.update({
            where: { id: orderId, customerId },
            data: {
                ...result.data,
                countrycode
            }
        })
    } catch (error: any) {
        console.log(error)
        return { message: 'Error occur!' }
    }

    redirect(`/cart/${orderId}/payment`)
}

export async function onPayment(prevState: any, formData: FormData): Promise<Record<string, string>> {

    const result = ShippingSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    return { message: 'Success' }
}