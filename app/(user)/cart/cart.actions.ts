'use server'

import { CartItemType, CookieCartType } from "@/libs/definations"
import { revalidatePath } from "next/cache"
import { getUser } from "../user.actions"
import { getCart, getCartItem, getCartItemsWithDetails, getProduct, getProductClass, removeCartItem, updateCartItem } from "../cart.server"
import { getCookieCartItems, setCookieCartItems } from "../cookie.server"

export async function getCartData() {
    const user = await getUser()
    if (user) {
        const cart = await getCart(user.id)
        if (!cart) return { cart, cartItems: [], errors: [] }
        const { cartItems, errors } = await getCartItemsWithDetails(cart.id)

        return { cart, cartItems, errors }
    }

    const carts = await getCookieCartItems()
    return await _getCookieCart(carts)
}

export async function deleteCartItem(class_id: number) {
    const user = await getUser()

    console.log('DELETE_CLASS_ID', class_id)

    if (user) {
        const cart = await getCart(user.id)
        const cartItem = await getCartItem(cart.id, class_id)
        if (!cartItem) return { code: 'Cart Item do not exist!' }
        const id = await removeCartItem(cartItem.id)
        console.log('DELETED_ID', id)
    } else {
        const carts = await getCookieCartItems()
        const deletedCart = carts.filter(cart => cart.id !== class_id)
        await setCookieCartItems(deletedCart)
    }

    revalidatePath('/cart')
    return { code: 'Cart item deleted!' }
}

export async function increaseQuantity(class_id: number) {
    const user = await getUser()

    const productClass = await getProductClass(class_id, true)
    if (!productClass) return { code: 'Poduct could not find!' }

    if (user) {
        const cart = await getCart(user.id)
        const cartItem = await getCartItem(cart.id, class_id)
        if (!cartItem) return { code: 'Cart Item do not exist!' }
        if (productClass.quantity == 0) {
            await removeCartItem(cartItem.id)
            revalidatePath('/cart')
            return { code: 'Poduct is out of stock!' }
        }
        await updateCartItem({ ...cartItem, quantity: Math.min(cartItem.quantity + 1, productClass.quantity) })
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

    revalidatePath('/cart')
    return { code: 'Qunatity increase!' }
}

export async function decreaseQuantity(class_id: number) {
    const user = await getUser()

    const productClass = await getProductClass(class_id, true)
    if (!productClass) return { code: 'Poduct could not find!' }

    if (user) {
        const cart = await getCart(user.id)
        const cartItem = await getCartItem(cart.id, class_id)
        if (!cartItem) return { code: 'Cart Item do not exist!' }
        if (productClass.quantity == 0) {
            await removeCartItem(cartItem.id)
            revalidatePath('/cart')
            return { code: 'Poduct is out of stock!' }
        }
        await updateCartItem({ ...cartItem, quantity: Math.min(cartItem.quantity - 1, 1) })
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

    revalidatePath('/cart')
    return { code: 'Qunatity decrease!' }
}

async function _getCookieCart(carts: CookieCartType[]) {
    const errors: string[] = []
    const cartItems: CartItemType[] = []
    for await (const item of carts) {
        const productClass = await getProductClass(item.id)

        if (productClass) {
            const product = await getProduct(productClass?.product_id)

            if (!product) errors.push('Product could not find')
            if (!productClass) errors.push('Product class could not find')

            if (!(productClass?.quantity || 0)) errors.push(`${product?.name} out of stock!`)
            else if (item.quantity < (productClass?.quantity || 0)) errors.push(`${product?.name} stock not enough!`)

            if (product && productClass) {
                cartItems.push({
                    ...item,
                    quantity: Math.min(productClass.quantity, item.quantity),
                    product: product,
                    productClass: productClass,
                } as CartItemType)
            }

        }
    }

    return { cart: undefined, cartItems, errors }
}
