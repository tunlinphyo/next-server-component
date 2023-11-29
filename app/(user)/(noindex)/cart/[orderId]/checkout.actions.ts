'use server'

import prisma from "@/libs/prisma"
import { getZodErrors, wait } from "@/libs/utils"
import { ShippingSchema } from "./checkout.schema"
import { redirect } from "next/navigation"

export async function getOrder(orderId: number) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        // include: {
        //     orderItems: {
        //         include: {
        //             product: {
        //                 select: {
        //                     name: true
        //                 }
        //             },
        //             productClass: {
        //                 select: {
        //                     price: true,
        //                     variant1: {
        //                         select: {
        //                             name: true
        //                         }
        //                     },
        //                     variant2: {
        //                         select: {
        //                             name: true
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     },
        //     address: true
        // }
    })

    console.log('ORDER_________', order)

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
    if (!orderId) return { message: 'Order id is required' }

    const result = ShippingSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    console.log('SHIPPING____', result.data)

    try {
        const order = await prisma.order.update({
            where: { id: orderId, customerId },
            data: result.data
        })
    } catch (error: any) {
        console.log(error)
        return { message: 'Error occur!' }
    }

    redirect(`/cart/${orderId}/payment`)
}