'use server'

import { GET, GET_ONE } from "@/libs/db"
import { CategoryType, ProductClassType, ProductType, VariantType } from "@/libs/definations"
import { wait } from "@/libs/utils"

export async function getProductDetail(id: number) {
    await wait()

    const product = await GET_ONE<ProductType>('products', { id, isDelete: false })
    if (!product) return

    if (product.variant_1_id) {
        product.variant1 = await _getVariant(product.variant_1_id)
    }
    if (product.variant_2_id) {
        product.variant2 = await _getVariant(product.variant_2_id)
    }

    product.categories = []
    for await (const category_id of (product.category_ids || [])) {
        const category = await GET_ONE<CategoryType>('product_categories', { id: category_id, isDelete: false })
        if (category) product.categories.push(category)
    }

    return product
}

export async function getProductClasses(id: number) {
    const classes = await GET<ProductClassType>('product_class', { product_id: id, isDelete: false })
    for await (const productClass of classes) {
        if (productClass.variant_1_id) {
            productClass.variant1 = await _getVariant(productClass.variant_1_id)
        }
        if (productClass.variant_2_id) {
            productClass.variant2 = await _getVariant(productClass.variant_2_id)
        }
    }
    return classes
}

async function _getVariant(id: number) {
    return await GET_ONE<VariantType>('product_variants', { id, isDelete: false })
}
