'use server'
import prisma from "@/libs/prisma"

export async function getTotalProductCategory() {
    return await prisma.category.count({
        where: { isDelete: false }
    })
}

export async function getTotalProductVariant() {
    return await prisma.variant.count({
        where: { isDelete: false }
    })
}

export async function getTotalProducts() {
    return await prisma.product.count({
        where: { isDelete: false }
    })
}
