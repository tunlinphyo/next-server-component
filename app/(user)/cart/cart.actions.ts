'use server'

import { wait } from "@/libs/utils"
import { cookies } from "next/headers"
import { COOKIE_CART } from "../user.const"
import { CartType, CookieCartType, ProductClassType, ProductType, VariantType } from "@/libs/definations"
import { GET, GET_ONE } from "@/libs/db"
import { revalidatePath } from "next/cache"

export async function getCart() {
    await wait()

    // CHECK_USER_LOGIN
    // IF LOGIN Set cart item to DB

    // ELSE Set to Cookie
    const cookieStore = cookies()
    const cookieCart = cookieStore.get(COOKIE_CART)

    const carts: CookieCartType[] = cookieCart?.value ? JSON.parse(cookieCart.value) : []

    const variants = await GET<VariantType>('product_variants', { isDelete: false })

    const cartProducts: CartType[] = []
    for await (const cart of carts) {
        const productClass = await GET_ONE<ProductClassType>('product_class', { id: cart.id })
        const product = await GET_ONE<ProductType>('products', { id: productClass?.product_id })

        if (productClass?.variant_1_id) {
            productClass.variant1 = variants.find(item => item.id == productClass.variant_1_id)
        }
        if (productClass?.variant_2_id) {
            productClass.variant2 = variants.find(item => item.id == productClass.variant_2_id)
        }

        if (product && productClass) {
            cartProducts.push({
                id: Date.now(),
                product,
                productClass,
                quantity: cart.quantity,
                isDelete: false
            } as CartType)
        }
    }
    console.log("CART_PAGE_DATA", cartProducts)

    return cartProducts
}

export async function deleteCartItem(id: number) {
    await wait()

    console.log('DELETE_ITEM', id)
    // CHECK_USER_LOGIN
    // IF LOGIN Set cart item to DB

    // ELSE Set to Cookie
    const cookieStore = cookies()
    const cookieCart = cookieStore.get(COOKIE_CART)

    const carts: CookieCartType[] = cookieCart?.value ? JSON.parse(cookieCart.value) : []
    const deletedCart = carts.filter(cart => cart.id !== id)
    cookieStore.set(COOKIE_CART, JSON.stringify(deletedCart))

    revalidatePath('/cart')
    return { code: 'Cart item deleted!' }
}

export async function increaseQuantity(id: number) {
    await wait()

    console.log('INCREASE_ITEM', id)
    // CHECK_USER_LOGIN
    // IF LOGIN Set cart item to DB

    // ELSE Set to Cookie
    const cookieStore = cookies()
    const cookieCart = cookieStore.get(COOKIE_CART)

    const carts: CookieCartType[] = cookieCart?.value ? JSON.parse(cookieCart.value) : []
    const deletedCart = carts.map(cart => {
        if (cart.id === id) {
            const quantity = cart.quantity + 1
            return { ...cart, quantity }
        } else return cart
    })
    cookieStore.set(COOKIE_CART, JSON.stringify(deletedCart))

    revalidatePath('/cart')
    return { code: 'Success!' }
}

export async function decreaseQuantity(id: number) {
    await wait()

    console.log('DECREASE_ITEM', id)
    // CHECK_USER_LOGIN
    // IF LOGIN Set cart item to DB

    // ELSE Set to Cookie
    const cookieStore = cookies()
    const cookieCart = cookieStore.get(COOKIE_CART)

    const carts: CookieCartType[] = cookieCart?.value ? JSON.parse(cookieCart.value) : []
    const deletedCart = carts.map(cart => {
        if (cart.id === id) {
            const quantity = Math.max(cart.quantity - 1, 1)
            return { ...cart, quantity }
        } else return cart
    })
    cookieStore.set(COOKIE_CART, JSON.stringify(deletedCart))

    revalidatePath('/cart')
    return { code: 'Success!' }
}
