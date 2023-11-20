'use server'

import { wait } from "@/libs/utils"
import { CategoryType, ProductType } from '@/libs/definations'
import { GET } from '@/libs/db';
import { getDBVariantsBy } from "@/libs/prisma/variant";
import { Prisma } from "@prisma/client";
import { VariantCount } from "./variants/variant.interface";

export async function getTotalProductCategory() {
    await wait()

    const categories = await GET<CategoryType>('product_categories', { isDelete: false })

    return categories.length
}

export async function getTotalProductVariant() {
    let query: Prisma.VariantAggregateArgs = {
        _count: { id: true },
        where: { isDelete: false }
    }
    const result = await getDBVariantsBy(query) as VariantCount

    return result._count.id
}

export async function getTotalProducts() {
    await wait()

    const products = await GET<ProductType>('products', { isDelete: false })

    return products.length
}
