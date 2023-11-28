'use server'

import { getCart, getCountCartItems, handleUserCart } from "./user/cart.server"
import { redirect } from "next/navigation"
import { clearCookieCart, clearCookieUser, getCookieCartItems, getCookieUser, setCookieUser } from "./user/cookie.server";
import { Customer } from "@prisma/client"

export async function isLogined() {
    return !!(await getCookieUser())
}

export async function getUser() {
    return await getCookieUser()
}

export async function getCartItemCount() {
    const user = await getUser()

    if (user) {
        const cart = await getCart(user.id)
        if (!cart) return 0
        return await getCountCartItems(cart.id)
    } else {
        const cartItems = await getCookieCartItems()
        if (!cartItems.length) return 0
        return cartItems.reduce((acc, item) => acc + item.quantity, 0)
    }
}

export async function handleSignIn(customer: Customer) {
    setCookieUser(customer)
    await handleUserCart(customer.id)
    clearCookieCart()
}

export async function handleSignOut() {
    clearCookieUser()
    clearCookieCart()
    redirect('/')
}