'use server'

import { getStockAndPrices } from "@/app/admin/(admin)/product/products/products.utils"
import { PER_PAGE } from "@/libs/const"
import { revalidatePath } from 'next/cache'
import { getUser } from "../user.actions"
import { createCartItem, getCart, getCartItem, updateCartItem } from "../user/cart.server"
import { getCookieCartItems, setCookieCartItems } from "../user/cookie.server"
import prisma from "@/libs/prisma"
import { Prisma } from "@prisma/client"
import { ProductWithPriceAndStock } from "@/app/admin/(admin)/product/products/products.interface"
import { FavouriteFormData } from "./product.interface"
import { wait } from "@/libs/utils"


export async function getProductPageLength(key: string, categoryId?: number) {
    const query: Prisma.ProductCountArgs = {
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
        },
    }
    if (categoryId) {
        (query.where?.AND as any[]).push({
            categories: {
                some: {
                    categoryId
                }
            }
        })
    }
    const count = await prisma.product.count(query)
    return Math.ceil(count / PER_PAGE)
}

export async function getProducts(page: number, key: string, categoryId?: number) {
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
    if (categoryId) {
        (query.where?.AND as any[]).push({
            categories: {
                some: {
                    categoryId
                }
            }
        })
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
        if (!cart) return { code: 'Cart could not find' }
        try {
            const cartItem = await getCartItem(cart.id, class_id)
            if (cartItem) {
                await updateCartItem({
                    id: cartItem.id,
                    productClassId: cartItem.productClassId,
                    quantity: cartItem.quantity + 1
                })
            } else {
                await createCartItem(cart.id, class_id, 1)
            }
        } catch(error: any) {
            return { code: error.message }
        }
    } else {
        let carts = await getCookieCartItems()
        const is = carts.find(item => item.id == class_id)
        const productClass = await prisma.productClass.findUnique({ where: { id: class_id } })
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

export async function getFavourites(customerId: number, productIds: number[]) {
    const favourites = await prisma.customerFavourite.findMany({
        where: {
            customerId,
            productId: {
                in: productIds
            }
        }
    })
    return favourites.map(item => item.productId)
}

export async function setFabourite(favData: FavouriteFormData) {
    try {
        if (favData.is) {
            await prisma.customerFavourite.create({
                data: {
                    customerId: favData.customerId,
                    productId: favData.productId
                }
            })
        } else {
            await prisma.customerFavourite.delete({
                where: {
                    customerId_productId: {
                        customerId: favData.customerId,
                        productId: favData.productId
                    }
                }
            })
        }
        revalidatePath(favData.pathname)
        return { code:  favData.is ? 'Added to favourite' : 'Removed from favourite' }
    } catch(e) {
        return { code: 'Error' }
    }
}
