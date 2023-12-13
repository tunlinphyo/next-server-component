'use server'

import { wait } from "@/libs/utils"
import { handleSignOut } from "../../user.actions"
import { revalidatePath } from "next/cache"
import prisma from "@/libs/prisma"
import { getStockAndPrices } from "@/app/admin/(admin)/product/products/products.utils"
import { ProductWithPriceAndStock } from "../../products/product.interface"
import { PER_PAGE } from "@/libs/const"


export async function onLogout(prevProp: any, formData: FormData) {
    await handleSignOut()

    revalidatePath('/')
    // redirect('/')
    return { code: 'Success!' }
}

export async function getCustomerAddress(customerId: number) {
    return await prisma.customerAddress.findFirst({
        where: { customerId, isDefault: true }
    })
}

export async function getFavouritesPageLength(customerId: number) {
    const count = await prisma.customerFavourite.count({
        where: { customerId }
    })
    return Math.ceil(count / PER_PAGE)
}

export async function getFavouriteProducts(customerId: number, page: number = 1) {
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const favourites = await prisma.customerFavourite.findMany({
        where: { customerId },
        include: {
            product: {
                include: {
                    images: true,
                    productClasses: {
                        where: { isDelete: false },
                        include: {
                            variant1: true,
                            variant2: true,
                        }
                    },
                }
            }
        },
        skip: start,
        take: PER_PAGE,
        orderBy: { createDate: "desc" }
    })
    const products: ProductWithPriceAndStock[] = []
    for (const favourite of favourites) {
        let product = favourite.product as ProductWithPriceAndStock
        const { stockTotal, minPrice, maxPrice } = getStockAndPrices(product.productClasses)
        product.minPrice = minPrice
        product.maxPrice = maxPrice
        product.quantity = stockTotal
        products.push(product)
    }
    return products
}

export async function getOrdersPageLength(customerId: number) {
    const count = await prisma.order.count({
        where: { customerId }
    })
    return Math.ceil(count / PER_PAGE)
}

export async function getOrders(customerId: number, page: number = 1) {
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const orders = await prisma.order.findMany({
        where: { customerId },
        include: {
            customerPayment: {
                include: {
                    payment: true
                }
            },
            orderStatus: true,
        },
        skip: start,
        take: PER_PAGE,
        orderBy: { createDate: "desc" }
    })

    return orders
}
