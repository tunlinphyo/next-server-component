'use server'

import { wait } from "@/libs/utils"
import { CategoryType, VariantType, ProductType } from '@/libs/definations'
import { GET } from '@/libs/db';

export async function getTotalProductCategory() {
    await wait()

    const categories = await GET<CategoryType>('product_categories', { isDelete: false })

    return categories.length
}

export async function getTotalProductVariant() {
    await wait()

    const categories = await GET<VariantType>("product_variants", { isDelete: false })

    return categories.length
}

export async function getTotalProducts() {
    await wait()

    const products = await GET<ProductType>('products', { isDelete: false })

    return products.length
}
