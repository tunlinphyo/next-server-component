'use server'

import { getStockAndPrices } from "@/app/admin/(admin)/product/products/products.utils"
import prisma from "@/libs/prisma"
import { ProductDetail, ProductWithPriceAndStock } from "../product.interface"

export async function getMetadata(id: number) {
    const product = await prisma.product.findUnique({ 
        where: { id, isDelete: false },
        select: {
            id: true,
            name: true,
            description: true,
            images: {
                select: {
                    imgUrl: true
                }
            }
        }
    })
    console.log("DEFAULT__________", product)
    return product
}

export async function getProductDetail(id: number) {
    const product = await prisma.product.findUnique({
        where: { id, isDelete: false },
        include: {
            images: true,
            productClasses: {
                where: { isDelete: false },
                include: {
                    variant1: true,
                    variant2: true,
                }
            },
            categories: {
                include: { category: true }
            },
            variant1: true,
            variant2: true,
        }

    }) as ProductDetail

    return product
}

export async function getRelativeProducts(id: number) {  // Product Id
    const products = await prisma.product.findMany({
        where: { id: { not: id } },
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
        take: 5,
        orderBy: { createDate: "desc" }
    }) as ProductWithPriceAndStock[]
    for (const product of products) {
        const { stockTotal, minPrice, maxPrice } = getStockAndPrices(product.productClasses)
        product.minPrice = minPrice
        product.maxPrice = maxPrice
        product.quantity = stockTotal
    }
    return products
}

