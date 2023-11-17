'use server'

import { cookies } from "next/headers"
import { COOKIE_CART, COOKIE_USER } from "./user.const"
import { CookieCartType, UserType } from "@/libs/definations"

export async function getCookieUser() {
    const cookieStore = cookies()
    const cookieUser = cookieStore.get(COOKIE_USER)

    const user: UserType = cookieUser?.value ? JSON.parse(cookieUser.value) : null
    return user
}

export async function setCookieUser(user: UserType) {
    const cookieStore = cookies()
    cookieStore.set(COOKIE_USER, JSON.stringify(user), { secure: true })
    return true
}

export async function clearCookieUser() {
    const cookieStore = cookies()
    cookieStore.delete(COOKIE_USER)
    return true
}

export async function getCookieCartItems() {
    const cookieStore = cookies()
    const cookieCart = cookieStore.get(COOKIE_CART)
    const carts: CookieCartType[] = cookieCart?.value ? JSON.parse(cookieCart.value) : []

    return carts
}

export async function setCookieCartItems(items: CookieCartType[]) {
    const cookieStore = cookies()
    cookieStore.set(COOKIE_CART, JSON.stringify(items))
    return true
}

export async function clearCookieCart() {
    const cookieStore = cookies()
    cookieStore.delete(COOKIE_CART)
    return true
}