'use server'

import { getStockAndPrices } from "@/app/admin/(admin)/product/products/products.utils"
import { PER_PAGE } from "@/libs/const"
import { GET, GET_ONE, QUERY } from "@/libs/db"
import { ProductClassType, ProductType, VariantType } from "@/libs/definations"
import { wait } from "@/libs/utils"
import { revalidatePath } from 'next/cache'
import { getUser } from "../user.actions"
import { createCartItem, getCart, getCartItem, updateCartItem } from "../cart.server"
import { getCookieCartItems, setCookieCartItems } from "../cookie.server"
import prisma from "@/libs/prisma"
import { Prisma } from "@prisma/client"
import { ProductWithPriceAndStock } from "@/app/admin/(admin)/product/products/products.interface"


export async function getProductPageLength(key: string) {
    const count = await prisma.product.count({
        where: {
            AND: [
                { isDelete: false },
                {
                    name: {
                        startsWith: key ? `%${key}%` : '',
                        mode: 'insensitive',
                    }
                }
            ],
        }
    })
    return Math.ceil(count / PER_PAGE)
}

export async function getProducts(page: number, key: string ) {
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const query: Prisma.ProductFindManyArgs = {
        where: {
            AND: [
                { isDelete: false },
                {
                    name: {
                        startsWith: key ? `%${key}%` : '',
                        mode: 'insensitive',
                    }
                }
            ]
        },
        include: {
            images: true,
            productClasses: {
                where: { isDelete: false },
                include: {
                    variant1: true,
                    variant2: true,
                }
            }
        },
        skip: start,
        take: PER_PAGE,
        orderBy: { createDate: "desc" }
    }
    const result = await prisma.product.findMany(query) as ProductWithPriceAndStock[]
    for await (const product of result) {
        const { stockTotal, minPrice, maxPrice } = getStockAndPrices(product.productClasses)
        product.minPrice = minPrice
        product.maxPrice = maxPrice
        product.quantity = stockTotal
    }
    return result
}

export async function addToCart(prevState: any, formData: FormData) {
    const user = await getUser()

    const class_id = Number(formData.get('class_id'))
    const pathname = String(formData.get('pathname'))

    if (user) {
        const cart = await getCart(user.id)
        try {
            const cartItem = await getCartItem(cart.id, class_id)
            if (cartItem) {
                await updateCartItem({ ...cartItem, quantity: cartItem.quantity + 1 })
            } else {
                await createCartItem(cart.id, class_id, 1)
            }
        } catch(error: any) {
            return { code: error.message }
        }
    } else {
        let carts = await getCookieCartItems()
        const is = carts.find(item => item.id == class_id)
        const productClass = await GET_ONE<ProductClassType>('product_class', { id: class_id, isDelete: false })
        if (!productClass) return { code: 'Product could not find' }
        if (!productClass.quantity) return { code: 'Out of stock' }

        if (is) {
            carts = carts.map(item => {
                if (item.id == class_id) return {
                    ...item,
                    quantity: Math.min(item.quantity + 1, productClass.quantity)
                }
                return item
            })
        } else {
            carts = [ ...carts, { id: class_id, quantity: 1 } ]
        }
        await setCookieCartItems(carts)
    }

    revalidatePath(pathname, "page")
    return { code: 'Success!' }
}
