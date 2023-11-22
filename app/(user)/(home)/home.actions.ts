'use server'

import { ProductWithPriceAndStock } from "@/app/admin/(admin)/product/products/products.interface"
import { getStockAndPrices } from "@/app/admin/(admin)/product/products/products.utils"
import { GET } from "@/libs/db"
import { CategoryType, ProductClassType, ProductType, VariantType } from "@/libs/definations"
import prisma from "@/libs/prisma"
import { wait } from "@/libs/utils"
import { Prisma } from "@prisma/client"

export async function getCategories() {
    return prisma.category.findMany({
        where: { isDelete: false, parentId: null }
    })
}

export async function getHomeProduct() {
    const query: Prisma.ProductFindManyArgs = {
        where: { isDelete: false },
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
        skip: 0,
        take: 5,
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