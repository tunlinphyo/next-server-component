'use server'

import prisma from "@/libs/prisma"
import { addSpaceEveryFourCharacters, getZodErrors, isObjectEmpty, maskNumber, wait } from "@/libs/utils"
import { CheckoutSchema, PaymentSchema, ShippingSchema } from "./checkout.schema"
import { redirect } from "next/navigation"
import { CreditCard, CustomerPaymentWithPayment, OrderWithPaymentAndAddress, OrderItemWidthDetail } from './checkout.interface';
import { decryptCookieValue } from "@/auth"
import { Order } from "@prisma/client"
import { COD_PAYMENT_ID, DELIVERY_AMOUNT, ORDER_STATUS_NEW, ORDER_STATUS_PAID } from "@/libs/const"
import { shippingValidator } from "./checkout.validator"

export async function getOrder(orderId: number, customerId: number) {
    return await prisma.order.findUnique({
        where: { id: orderId, customerId },
        include: {
            address: true,
            customerPayment: true,
        }
    }) as OrderWithPaymentAndAddress
}

export async function getOrderItems(orderId: number) {
    return await prisma.orderItem.findMany({
        where: { orderId },
        include: {
            product: {
                include: {
                    images: true,
                }
            },
            productClass: {
                include: {
                    variant1: true,
                    variant2: true,
                }
            },
            orderStatus: true
        }
    }) as OrderItemWidthDetail[]
}

export async function getPayment(id: number) {
    return await prisma.payment.findUnique({
        where: { id }
    })
}

export async function getAllCustomerAddress(customerId: number) {
    return await prisma.customerAddress.findMany({
        where: { customerId }
    })
}

export async function getCreditCardPayments() {
    return await prisma.payment.findMany({
        where: { isDisabled: false, isCredit: true },
    })
}

export async function getCustomerPayemnts(customerId: number) {
    const codPayment = await prisma.customerPayment.findFirst({
        where: { customerId, paymentId: COD_PAYMENT_ID }
    })
    if (!codPayment) {
        await prisma.customerPayment.create({
            data: {
                customerId,
                paymentId: COD_PAYMENT_ID
            }
        })
    }
    const customerPayments = await prisma.customerPayment.findMany({
        where: { customerId },
        include: {
            payment: true
        },
        orderBy: { createDate: "desc" }
    }) as CustomerPaymentWithPayment[]
    for (const customerPayment of customerPayments) {
        if (customerPayment.cardData) {
            const cardData: CreditCard = JSON.parse(decryptCookieValue(customerPayment.cardData))
            const card: CreditCard = {
                ...cardData,
                cardNumber: addSpaceEveryFourCharacters(maskNumber(cardData.cardNumber, 12)),
                cvc: maskNumber(cardData.cvc)
            }
            customerPayment.card = card
        }
    }
    return customerPayments
}

export async function getCustomerPayment(id: number, hidden: boolean = false) {
    const customerPayment = await prisma.customerPayment.findUnique({
        where: { id },
        include: { payment: true }
    }) as CustomerPaymentWithPayment
    if (customerPayment.cardData) {
        const cardData: CreditCard = JSON.parse(decryptCookieValue(customerPayment.cardData))
        if (hidden) {
            const card: CreditCard = {
                ...cardData,
                cardNumber: addSpaceEveryFourCharacters(maskNumber(cardData.cardNumber, 12)),
                cvc: maskNumber(cardData.cvc)
            }
            customerPayment.card = card
        } else {
            customerPayment.card = cardData
        }
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
        const { subtotal, errors } = await processOrder(orderId)
        const order = await prisma.order.update({
            where: { id: orderId, customerId },
            data: {
                ...result.data,
                subTotal: subtotal,
                totalAmount: subtotal + DELIVERY_AMOUNT,
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
    const result = PaymentSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        console.log(getZodErrors(result.error.issues))
        return getZodErrors(result.error.issues)
    }

    try {
        const { subtotal, errors } = await processOrder(result.data.orderId)
        const order = await prisma.order.update({
            where: { id: result.data.orderId },
            data: {
                customerPaymentId: result.data.customerPaymentId,
                subTotal: subtotal,
                totalAmount: subtotal + DELIVERY_AMOUNT,
            }
        })
        // const {} = shippingValidator(order)
    } catch (error: any) {
        return { message: error.message }
    }


    redirect(`/cart/${result.data.orderId}/review`)
}

export async function onCheckout(prevState: any, formData: FormData): Promise<Record<string, string>> {
    const orderId = formData.get('orderId')

    if (!orderId) return { message: 'Order ID is required!' }

    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
            include: {
                customerPayment: true,
            }
        })
        if (!order) return { message: 'Order could not find!' }
        // check data
        const result = checkData(order)
        if (result) return result

        // check order items
        const { subtotal, errors } = await processOrder(order.id)
        const isCOD = order.customerPayment?.paymentId === COD_PAYMENT_ID

        // update order status base on payment
        await prisma.order.update({
            where: { id: order.id },
            data: {
                orderDate: new Date(),
                orderStatusId: isCOD ? ORDER_STATUS_NEW : ORDER_STATUS_PAID,
                subTotal: subtotal,
                totalAmount: subtotal + DELIVERY_AMOUNT,
                paymentAmount: isCOD ? 0 : subtotal + DELIVERY_AMOUNT
            }
        })
    } catch(error: any) {
        return { message: error.message }
    }

    redirect(`/cart/${orderId}/success`)
}

async function processOrder(orderId: number) {
    const errors: string[] = []

    const orderItems = await prisma.orderItem.findMany({
        where: { orderId: orderId },
        include: {
            product: true,
            productClass: true,
        }
    })

    let subtotal: number = 0
    for await (const item of orderItems) {
        if (item.productClass.quantity <= 0) {
            errors.push(`${item.product.name} is removed because of not stock.`)
            await prisma.orderItem.delete({
                where: { id: item.id }
            })
        } else if (item.quantity > item.productClass.quantity) {
            const quantity = item.productClass.quantity
            errors.push(`${item.product.name} qunatity is not enough.`)
            await prisma.orderItem.update({
                where: { id: item.id },
                data: { quantity }
            })
            subtotal += item.productClass.price * quantity
        } else {
            subtotal += item.productClass.price * item.quantity
        }
    }

    return { subtotal, errors }
}

function checkData(order: Order) {
    const result = CheckoutSchema.safeParse(order)

    if (!result.success) {
        console.log(getZodErrors(result.error.issues))
        return getZodErrors(result.error.issues)
    }

    return null
}