'use server'

import { cookies } from "next/headers"
import { COOKIE_CART, COOKIE_USER } from "./user.const"
import { CookieCartType } from "@/libs/definations"
import { ONE_DAY } from "@/libs/const"
import { CustomerType } from "@/libs/prisma/definations"
import { decryptCookieValue, encryptCookieValue } from "@/auth"
import { Customer } from "@prisma/client"

export async function getCookieUser() {
    const cookieStore = cookies()
    
    const cookieUser = cookieStore.get(COOKIE_USER)

    if (!cookieUser) return
    const decrypted = decryptCookieValue(cookieUser?.value)
    if (!decrypted) return
    const customer = JSON.parse(decrypted) as CustomerType

    console.log('CUSTOMER_______', customer)
    
    return customer
}

export async function setCookieUser(user: Customer) {
    const cookieStore = cookies()

    const currentDate = new Date()
    const newDate = new Date(currentDate.getTime() + (ONE_DAY * 30))

    const cookieUser: CustomerType = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isDelete: user.isDelete,
        expiredAt: newDate,
    }

    const hashedValue = encryptCookieValue(JSON.stringify(cookieUser))

    cookieStore.set(COOKIE_USER, hashedValue)
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