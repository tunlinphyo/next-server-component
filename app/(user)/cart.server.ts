'use server'

import { DELETE, GET, GET_ONE, PATCH, POST } from "@/libs/db"
import { CartItemType, CartType, CookieCartType, DBCartItemType, ProductClassType, ProductType, VariantType } from "@/libs/definations"
import { getCookieCartItems } from "./cookie.server"


export async function getCart(userId: number) {
    const cart = await GET_ONE<CartType>('carts', { user_id: userId, isDelete: false })

    if (!cart) return createCart(userId)
    return cart
}

export async function createCart(userId: number) {
    const newCart: Partial<CartType> = {
        user_id: userId,
    }

    const cart = await POST<CartType>('carts', newCart)
    return cart
}

export async function createCartItem(cartId: number, classId: number, quantity: number) {
    const productClass = await GET_ONE<ProductClassType>('product_class', { id: classId, isDelete: false })

    if (!productClass) throw new Error('Product class could not find')
    if (!productClass.quantity) throw new Error('Product stock is zero')

    const updatedQuantity = Math.min(productClass.quantity, quantity)
    const newCartItem: Partial<DBCartItemType> = {
        cart_id: cartId,
        product_id: productClass.product_id,
        product_class_id: productClass.id,
        quantity: updatedQuantity,
    }
    return await POST<DBCartItemType>('cart_items', newCartItem)
}

export async function getCartItem(cart_id: number, product_class_id: number) {
    return await GET_ONE<DBCartItemType>('cart_items', { cart_id, product_class_id })
}

export async function updateCartItem(data: Partial<DBCartItemType>) {
    const productClass = await GET_ONE<ProductClassType>('product_class', { id: data.product_class_id, isDelete: false })
    if (productClass && data.quantity) {
        const updatedQuantity = Math.min(productClass.quantity, data.quantity)
        data = { ...data, quantity: updatedQuantity }
    }
    return await PATCH<DBCartItemType>('cart_items', data)
}

export async function getCartItems(cart_id: number) {
    const dbItems = await GET<DBCartItemType>('cart_items', { cart_id })

    return dbItems || []
}

export async function removeCartItem(id: number) {
    return await DELETE<CartItemType>('cart_items', id, true)
}

export async function getCartItemsWithDetails(cart_id: number) {
    const errors: string[] = []
    const dbItems = await GET<DBCartItemType>('cart_items', { cart_id })

    const cartItems = []
    for await (const item of dbItems) {
        const product = await getProduct(item.product_id)
        const productClass = await getProductClass(item.product_class_id)

        if (!product) errors.push('Product could not find')
        if (!productClass) errors.push('Product class could not find')

        if (!(productClass?.quantity || 0)) errors.push(`${product?.name} out of stock!`)
        else if (item.quantity < (productClass?.quantity || 0)) errors.push(`${product?.name} stock not enough!`)

        if (product && productClass && productClass.quantity) {
            const cartItem = {
                ...item,
                quantity: Math.min(productClass.quantity, item.quantity),
                product: product,
                productClass: productClass,
            } as CartItemType
            cartItems.push(cartItem)
        }
    }
    return { cartItems, errors }
}


export async function getProduct(id: number) {
    return await GET_ONE<ProductType>('products', { id, isDelete: false })
}

export async function getProductClass(id: number, noVariant: boolean = false) {
    const productClass = await GET_ONE<ProductClassType>('product_class', { id })

    if (!productClass) return

    if (!noVariant) {
        if (productClass.variant_1_id) {
            const variant = await GET_ONE<VariantType>('product_variants', { id: productClass.variant_1_id, isDelete: false })
            productClass.variant1 = variant
        }
        if (productClass.variant_2_id) {
            const variant = await GET_ONE<VariantType>('product_variants', { id: productClass.variant_2_id, isDelete: false })
            productClass.variant2 = variant
        }
    }

    return productClass
}

export async function handleUserCart(userId: number) {
    const cookieCartItems = await getCookieCartItems()
    if (!cookieCartItems.length) return

    let cart = await getCart(userId)
    const cartItems = await getCartItems(cart.id)
    _createCartItems(cart.id, cartItems, cookieCartItems)
}

async function _createCartItems(cartId: number, cartItems: DBCartItemType[], items: CookieCartType[]) {
    for await (const item of items) {
        try {
            const oldItem = cartItems.find(cartItem => cartItem.product_class_id == item.id)
            const productClass = await GET_ONE<ProductClassType>('product_class', { id: item.id, isDelete: false })
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

