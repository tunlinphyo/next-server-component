'use server'

import { CookieCartType } from "@/libs/definations"
import { getCookieCartItems } from "./cookie.server"
import prisma from "@/libs/prisma"
import { CartItem } from "@prisma/client"
import { CartWithItems } from "./cart.interface"


export async function getCart(customerId: number) {
    const cart = await prisma.cart.findUnique({
        where: { customerId },
        include: {
            cartItems: true,
        }
    })

    if (!cart) return createCart(customerId)
    return cart
}

export async function getCartItems(cartId: number) {
    return await prisma.cartItem.findMany({
        where: { cartId }
    })
}

export async function createCart(customerId: number) {
    try {
        const cart = await prisma.cart.create({
            data: { customerId }
        })
        return cart
    } catch (error) {
        console.log(error)
    }
}

export async function createCartItem(cartId: number, classId: number, quantity: number) {
    const productClass = await prisma.productClass.findUnique({
        where: { id: classId }
    })

    if (!productClass) throw new Error('Product class could not find')
    if (!productClass.quantity) throw new Error('Product stock is zero')

    const updatedQuantity = Math.min(productClass.quantity, quantity)
    return await prisma.cartItem.create({
        data: {
            cartId,
            productId: productClass.productId,
            productClassId: productClass.id,
            quantity: updatedQuantity,
        }
    })
}

export async function getCartItem(productClassId: number) {
    return await prisma.cartItem.findFirst({
        where: {
            productClassId
        }
    })
}

export async function getCountCartItems(cartId: number) {
    const count = await prisma.cartItem.count({
        where: { cartId }
    })
    return count
}

export async function updateCartItem(data: Partial<CartItem>) {
    const productClass = await prisma.productClass.findUnique({
        where: { id: data.productClassId }
    })
    if (productClass && data.quantity) {
        const updatedQuantity = Math.min(productClass.quantity, data.quantity)
        data = { ...data, quantity: updatedQuantity }
    }
    return await prisma.cartItem.update({
        where: { id: data.id },
        data
    })
}

export async function removeCartItem(id: number) {
    return await prisma.cartItem.delete({
        where: { id }
    })
}

export async function getCartWithDetails(customerId: number) {
    return await prisma.cart.findUnique({
        where: { customerId },
        include: {
            cartItems: {
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
                }
            }
        }
    }) as CartWithItems
}

export async function handleUserCart(userId: number) {
    const cookieCartItems = await getCookieCartItems()
    if (!cookieCartItems.length) return

    let cart = await getCart(userId)
    if (cart) _createCartItems(cart.id, cookieCartItems)
}

async function _createCartItems(cartId: number, items: CookieCartType[]) {
    const cartItems = await getCartItems(cartId)
    for await (const item of items) {
        try {
            const oldItem = cartItems.find(cartItem => cartItem.productClassId == item.id)
            const productClass = await prisma.productClass.findUnique({ where: { id: item.id } })
            if (!productClass) continue
            if (oldItem) {
                await updateCartItem({ ...oldItem, quantity: oldItem.quantity + item.quantity })
            } else {
                await createCartItem(cartId, item.id, item.quantity)
            }
        } catch(error) {
            console.log(error, item)
        }
    }
}

