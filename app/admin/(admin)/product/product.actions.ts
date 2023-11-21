'use server'

import { wait } from "@/libs/utils"
import { ProductType } from '@/libs/definations'
import { GET } from '@/libs/db';
import { Prisma } from "@prisma/client";
import { VariantCount } from "./variants/variant.interface";
import prisma from "@/libs/prisma";
import { CategoryCount } from "./categories/categories.interface";

export async function getTotalProductCategory() {
    let query: Prisma.CategoryAggregateArgs = {
        _count: { id: true },
        where: { isDelete: false }
    }
    const result = await prisma.category.aggregate(query) as CategoryCount

    return result._count.id
}

export async function getTotalProductVariant() {
    let query: Prisma.VariantAggregateArgs = {
        _count: { id: true },
        where: { isDelete: false }
    }
    const result = await prisma.variant.aggregate(query) as VariantCount

    return result._count.id
}

export async function getTotalProducts() {
    await wait()

    const products = await GET<ProductType>('products', { isDelete: false })

    return products.length
}
