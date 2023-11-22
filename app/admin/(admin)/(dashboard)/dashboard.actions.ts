'use server'

import prisma from "@/libs/prisma"
import { Product } from "@prisma/client"
import { getStockAndPrices } from "../product/products/products.utils"
import { ProductWithPriceAndStock } from "../product/products/products.interface"


export async function getLatestProducts() {
    const products = await prisma.product.findMany({
        where: { isDelete: false },
        include: {
            images: true,
            productClasses: {
                where: { isDelete: false },
            }
        },
        skip: 0,
        take: 5,
        orderBy: [
            { updateDate: "desc" },
            { createDate: "desc" }
        ]
    }) as ProductWithPriceAndStock[]
    const getDate = (product: Product) => product.updateDate || product.createDate
    for await (const product of products) {
        const { stockTotal, minPrice, maxPrice } = getStockAndPrices(product.productClasses)
        product.minPrice = minPrice
        product.maxPrice = maxPrice
        product.quantity = stockTotal
    }

    return { lastDate: getDate(products[0]), products }
}
