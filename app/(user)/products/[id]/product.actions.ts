'use server'

import { getStockAndPrices } from "@/app/admin/(admin)/product/products/products.utils"
import { GET, GET_ONE } from "@/libs/db"
import { CategoryType, ProductClassType, ProductType, VariantType } from "@/libs/definations"
import { getRandomElements, wait } from "@/libs/utils"

export async function getMetadata(id: number) {
    return GET_ONE<ProductType>('products', { id })
}

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

export async function getRelativeProducts(id: number) {  // Product Id
    await wait()

    const products = await GET<ProductType>('products', { isDelete: false })
    const variants = await GET<VariantType>('product_variants', { isDelete: false })

    const randomIds = getRandomElements(products.map(item => item.id), 5)

    const relatedPtoducts: ProductType[] = []
    for await (const product_id of randomIds) {
        if (product_id == id) continue
        const product = products.find(item => item.id == product_id) as ProductType
        const productClasses = await GET<ProductClassType>('product_class', { product_id: product.id, isDelete: false })
        const { stockTotal, minPrice, maxPrice } = getStockAndPrices(productClasses)

        for await (const pClass of productClasses) {
            if (pClass.variant_1_id) {
                pClass.variant1 = variants.find(item => item.id == pClass.variant_1_id)
            }
            if (pClass.variant_2_id) {
                pClass.variant2 = variants.find(item => item.id == pClass.variant_2_id)
            }
        }

        if (productClasses.length) {
            product.classes = productClasses
            product.price = minPrice
            product.minPrice = minPrice
            product.maxPrice = maxPrice
            product.quantity = stockTotal
        }
        relatedPtoducts.push(product)
    }

    return relatedPtoducts
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

async function _getProduct(id: number) {
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
