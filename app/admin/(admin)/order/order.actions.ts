'use server'

import prisma from "@/libs/prisma"

export async function getPaymentMethodCount() {
    return prisma.payment.count()
}

export async function getOrderCount() {
    return prisma.order.count()
}