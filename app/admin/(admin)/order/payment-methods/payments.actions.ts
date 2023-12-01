'use server'

import { PER_PAGE } from "@/libs/const"
import prisma from "@/libs/prisma"
import { CreatePaymentSchema, PaymentSchema } from "./payments.schema"
import { getZodErrors } from "@/libs/utils"
import { deleteImage } from "@/libs/images"
import { revalidatePath } from "next/cache"


export async function getPaymentsPageLength() {
    const count = await prisma.payment.count()

    return Math.ceil(count / PER_PAGE)
}

export async function getPayemnts() {
    return await prisma.payment.findMany({
        orderBy: { order: "asc" }
    })
}

export async function getPayemnt(id: number) {
    return await prisma.payment.findUnique({
        where: { id }
    })
}

export async function onPaymentCreate(prevState: any, formData: FormData): Promise<Record<string, string>> {
    const result = CreatePaymentSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const imagesToDelete = formData.getAll('delete_images') as string[]
    for await (const img of imagesToDelete) {
        await deleteImage(img)
    }

    try {
        const maxOrderNumber = await prisma.payment.aggregate({
            _max: {
                order: true,
            },
        })
        const max = maxOrderNumber._max.order || 0
        await prisma.payment.create({
            data: {
                ...result.data,
                isDisabled: !result.data.isDisabled,
                order: max + 1
            }
        })
    } catch (error: any) {
        console.log(error)
        return { message: error.message }
    }
    revalidatePath('/admin/order/payment-methods')
    return { back: 'go-back', message: 'Success' }
}

export async function onPaymentEdit(prevState: any, formData: FormData): Promise<Record<string, string>> {
    const result = PaymentSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        console.log('ERRORS', getZodErrors(result.error.issues))
        return getZodErrors(result.error.issues)
    }

    const imagesToDelete = formData.getAll('delete_images') as string[]
    for await (const img of imagesToDelete) {
        await deleteImage(img)
    }

    try {
        await prisma.payment.update({
            where: { id: result.data.id },
            data: {
                ...result.data,
                isDisabled: !result.data.isDisabled
            }
        })
    } catch (error: any) {
        console.log(error)
        return { message: error.message }
    }
    revalidatePath('/admin/order/payment-methods')
    return { back: 'go-back', message: 'Success' }
}
