'use server'

import prisma from "@/libs/prisma"
import { wait } from "@/libs/utils";
import { Prisma } from "@prisma/client";

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

export async function onShipping(prevState: any, formData: FormData): Promise<Record<string, string>> {
    await wait()
    return { message: 'Success!' }
}