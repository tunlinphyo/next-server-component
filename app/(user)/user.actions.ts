'use server'

import { wait } from "@/libs/utils"
import { cookies } from "next/headers"
import { COOKIE_CART } from "./user.const"
import { CookieCartType } from "@/libs/definations"

export async function getCartItemCount() {
    await wait()

    // CHECK_USER_LOGIN
    // IF LOGIN Get cart from DB

    // ELSE Get from Cookie
    const cookieStore = cookies()
    const cookieCart = cookieStore.get(COOKIE_CART)

    const cart: CookieCartType[] = cookieCart?.value ? JSON.parse(cookieCart.value) : []

    console.log('CART_COUNT', cart)

    return cart.reduce((acc, item) => acc + item.quantity, 0)
}