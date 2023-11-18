'use server'

import { getStockAndPrices } from "@/app/admin/(admin)/product/products/products.utils"
import { GET } from "@/libs/db"
import { ProductClassType, ProductType, VariantType } from "@/libs/definations"
import { wait } from "@/libs/utils"

export async function getHomeProduct() {
    await wait()

    const getDate = (product: ProductType) => product.updateDate || product.createDate

    const products = await GET<ProductType>('products', { isDelete: false })
    const sortedProducts = products.sort((a, b) => {
        if (getDate(a) < getDate(b)) return 1
        if (getDate(a) > getDate(b)) return -1
        return 0
    })

    const variants = await GET<VariantType>('product_variants', { isDelete: false })

    const latest = sortedProducts.slice(0, 5)
    const result: ProductType[] = []
    for await (const product of latest) {
        const productClasses = await GET<ProductClassType>('product_class', { product_id: product.id, isDelete: false })
        const { stockTotal, minPrice, maxPrice } = getStockAndPrices(productClasses)
        
        if (productClasses.length) {
            
            for await (const pClass of productClasses) {
                if (pClass.variant_1_id) {
                    pClass.variant1 = variants.find(item => item.id == pClass.variant_1_id)
                }
                if (pClass.variant_2_id) {
                    pClass.variant2 = variants.find(item => item.id == pClass.variant_2_id)
                }
            }
    
            product.classes = productClasses
            product.price = minPrice
            product.minPrice = minPrice
            product.maxPrice = maxPrice
            product.quantity = stockTotal
        }
        result.push(product)
    }
    return result
}