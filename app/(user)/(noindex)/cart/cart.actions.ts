'use server'

import { CookieCartType } from "@/libs/definations"
import { revalidatePath } from "next/cache"
import { getUser } from "../../user.actions"
import { getCart, getCartItem, getCartWithDetails, removeCartItem, updateCartItem } from "../../user/cart.server"
import { getCookieCartItems, setCookieCartItems } from "../../user/cookie.server"
import prisma from "@/libs/prisma"
import { CartWithItems, CookieCartItem } from "../../user/cart.interface"
import { redirect } from "next/navigation"

export async function getCartData(): Promise<CartWithItems | { cartItems: CookieCartItem[] }> {
    const user = await getUser()
    if (user) {
        const cart = await getCartWithDetails(user.id)

        return cart
    }

    const carts = await getCookieCartItems()
    return await _getCookieCart(carts)
}

export async function deleteCartItem(class_id: number) {
    const user = await getUser()

    console.log('DELETE_CLASS_ID', class_id)

    if (user) {
        const cart = await getCart(user.id)
        if (!cart) return { code: 'Cart do not exist!' }
        const cartItem = await getCartItem(cart.id, class_id)
        if (!cartItem) {
            revalidatePath('/cart', "page")
            return { code: 'Cart Item do not exist!' }
        }
        const id = await removeCartItem(cartItem.id)
        console.log('DELETED_ID', id)
    } else {
        const carts = await getCookieCartItems()
        const deletedCart = carts.filter(cart => cart.id !== class_id)
        await setCookieCartItems(deletedCart)
    }

    revalidatePath('/cart', "page")
    return { code: 'Cart item deleted!' }
}

export async function increaseQuantity(class_id: number) {
    const user = await getUser()

    const productClass = await prisma.productClass.findUnique({ where: { id: class_id }})
    if (!productClass) return { code: 'Poduct could not find!' }

    if (user) {
        const cart = await getCart(user.id)
        if (!cart) return { code: 'Cart do not exist!' }
        const cartItem = await getCartItem(cart.id, class_id)
        if (!cartItem) {
            revalidatePath('/cart', "page")
            return { code: 'Cart Item do not exist!' }
        }
        if (productClass.quantity == 0) {
            await removeCartItem(cartItem.id)
            revalidatePath('/cart', "page")
            return { code: 'Poduct is out of stock!' }
        }
        await updateCartItem({
            id: cartItem.id,
            productClassId: cartItem.productClassId,
            quantity: Math.min(cartItem.quantity + 1, productClass.quantity)
        })
    } else {
        const carts = await getCookieCartItems()
        const updatedCart = carts.map(cart => {
            if (cart.id === class_id) {
                const quantity = cart.quantity + 1
                return { ...cart, quantity }
            } else return cart
        })
        await setCookieCartItems(updatedCart)
    }

    revalidatePath('/cart', "page")
    return { code: 'Qunatity increase!' }
}

export async function decreaseQuantity(class_id: number) {
    const user = await getUser()

    const productClass = await prisma.productClass.findUnique({ where: { id: class_id }})
    if (!productClass) return { code: 'Poduct could not find!' }

    if (user) {
        const cart = await getCart(user.id)
        if (!cart) return { code: 'Cart do not exist!' }
        const cartItem = await getCartItem(cart.id, class_id)
        if (!cartItem) {
            revalidatePath('/cart', "page")
            return { code: 'Cart Item do not exist!' }
        }
        if (productClass.quantity == 0) {
            await removeCartItem(cartItem.id)
            revalidatePath('/cart', "page")
            return { code: 'Poduct is out of stock!' }
        }
        await updateCartItem({
            id: cartItem.id,
            productClassId: cartItem.productClassId,
            quantity: Math.max(cartItem.quantity - 1, 1)
        })
    } else {
        const carts = await getCookieCartItems()
        const updatedCart = carts.map(cart => {
            if (cart.id === class_id) {
                const quantity = Math.max(cart.quantity - 1, 1)
                return { ...cart, quantity }
            } else return cart
        })
        await setCookieCartItems(updatedCart)
    }

    revalidatePath('/cart', "page")
    return { code: 'Qunatity decrease!' }
}

async function _getCookieCart(carts: CookieCartType[]) {
    const cartItems: CookieCartItem[] = []
    for await (const item of carts) {
        const productClass = await prisma.productClass.findUnique({
            where: { id: item.id },
            include: {
                product: {
                    include: {
                        images: true,
                    }
                },
                variant1: true,
                variant2: true,
            }
        })

        if (productClass) {
            const product = productClass.product
            cartItems.push({
                id: item.id,
                quantity: Math.min(productClass.quantity, item.quantity),
                product: product,
                productClass: productClass,
            } as CookieCartItem)

        }
    }

    return { cartItems }
}

export async function onCheckout(cartId: number) {
    const errors: string[] = []
    const cartItems = await prisma.cartItem.findMany({
        where: { cartId },
        include: {
            product: true,
            productClass: true
        }
    })

    for await (const item of cartItems) {
        if (item.productClass.quantity <= 0) {
            errors.push(`${item.product.name} is removed because of not stock.`)
            await prisma.cartItem.delete({
                where: { id: item.id }
            })
        } else if (item.quantity > item.productClass.quantity) {
            const quantity = item.productClass.quantity
            errors.push(`${item.product.name} qunatity is not enough.`)
            await prisma.cartItem.update({
                where: { id: item.id },
                data: { quantity }
            })
        }
    }

    if (errors.length) return { errors }

    redirect('/cart/checkout/shipping')
} 

async function createOrder(cartId: number) {
    const cart = await prisma.cart.findUnique({
        where: { id: cartId }
    })
}