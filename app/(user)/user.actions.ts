'use server'

import { wait } from "@/libs/utils"
import { UserType } from "@/libs/definations"
import { getCart, getCartItems, handleUserCart } from "./cart.server"
import { redirect } from "next/navigation"
import { clearCookieCart, clearCookieUser, getCookieCartItems, getCookieUser, setCookieUser } from "./cookie.server";

export async function isLogined() {
    await wait()
    return !!(await getCookieUser())
}

export async function getUser() {
    await wait()
    return await getCookieUser()
}

export async function getCartItemCount() {
    const user = await getUser()

    if (user) {
        const cart = await getCart(user.id)
        const cartItems = await getCartItems(cart.id)
        console.log('CART_COUNT', cart)
        return cartItems.reduce((acc, item) => acc + item.quantity, 0)
    } else {
        const cartItems = await getCookieCartItems()
        if (!cartItems.length) return 0
        return cartItems.reduce((acc, item) => acc + item.quantity, 0)
    }
}

export async function handleSignIn(user: UserType) {
    setCookieUser(user)
    await handleUserCart(user.id)
    clearCookieCart()

}

export async function handleSignOut() {
    clearCookieUser()
    clearCookieCart()
    redirect('/')
}