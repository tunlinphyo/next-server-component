'use server'

import prisma from "@/libs/prisma"
import { addSpaceEveryFourCharacters, getZodErrors, isObjectEmpty, maskNumber, wait } from "@/libs/utils"
import { ShippingSchema } from "./checkout.schema"
import { redirect } from "next/navigation"
import { FormArrayType, GenericObject } from "@/libs/definations"
import { CreditCard, CustomerPaymentWithPayment, OrderWithPaymentAndAddress } from "./checkout.interface"
import { decryptCookieValue } from "@/auth"

export async function getOrder(orderId: number, customerId: number) {
    const order = await prisma.order.findUnique({
        where: { id: orderId, customerId },
        include: {
            address: true,
            customerPayment: true,
        }
    }) as OrderWithPaymentAndAddress

    return order
}

export async function getAllCustomerAddress(customerId: number) {
    return await prisma.customerAddress.findMany({
        where: { customerId }
    })
}

export async function getCreditCardPayemnts() {
    return await prisma.payment.findMany({
        where: { isDisabled: false, isCredit: true }
    })
}

export async function getCustomerPayemnts(customerId: number) {
    const customerPayments = await prisma.customerPayment.findMany({
        where: {
            customerId,
            payment: {
                isCredit: true,
            }
        },
        include: {
            payment: true
        }
    }) as CustomerPaymentWithPayment[]
    for (const customerPayment of customerPayments) {
        if (customerPayment.cardData) {
            const cardData: CreditCard = JSON.parse(decryptCookieValue(customerPayment.cardData))
            const card: CreditCard = {
                ...cardData,
                cardNumber: addSpaceEveryFourCharacters(maskNumber(cardData.cardNumber, 12)),
                cvc: maskNumber(cardData.cvc, 4)
            }
            customerPayment.card = card
        }
    }
    return customerPayments
}

export async function getCustomerPayment(id: number) {
    const customerPayment = await prisma.customerPayment.findUnique({
        where: { id },
        include: { payment: true }
    }) as CustomerPaymentWithPayment
    if (customerPayment.cardData) {
        const cardData: CreditCard = JSON.parse(decryptCookieValue(customerPayment.cardData))
        customerPayment.card = cardData
    }

    return customerPayment
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