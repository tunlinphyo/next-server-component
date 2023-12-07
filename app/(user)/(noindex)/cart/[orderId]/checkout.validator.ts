"use server"

import { Order } from "@prisma/client"
import { ShippingSchema } from "./checkout.schema";
import { getZodErrors } from "@/libs/utils";
import prisma from "@/libs/prisma";
import { DELIVERY_AMOUNT } from "@/libs/const";
import { OrderItemWidthDetail } from "./checkout.interface";

export interface ValidatorReturnInterface<T> {
    errors: string[];
    success: boolean;
    data?: T;
}

export interface ShippingInterface {
    name: string;
    email: string;
    phone: string;
    addressId: number;
    deliveryAmount: number;
    note?: string;
}

export function shippingValidator(order: Order): ValidatorReturnInterface<ShippingInterface> {
    const errors: string[] = []

    const result = ShippingSchema.safeParse(order)

    if (!result.success) {
        const errorObj = getZodErrors(result.error.issues)
        Object.values(errorObj).forEach(message => {
            errors.push(message)
        })
    }
    let data: ShippingInterface | undefined
    if (result.success) {
        data = {
            ...result.data,
            deliveryAmount: DELIVERY_AMOUNT
        }
    }

    return {
        success: result.success,
        errors,
        data
    }
}

export async function stockValidator(orderItems: OrderItemWidthDetail[]): Promise<ValidatorReturnInterface<number>> {
    const errors: string[] = []

    let subtotal: number = 0
    let itemCount: number = 0
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
            itemCount += 1
        } else {
            subtotal += item.productClass.price * item.quantity
            itemCount += 1
        }
    }

    return { 
        success: !!itemCount,
        errors,
        data: subtotal
    }
}
