'use server'

import { GET } from "@/libs/db"
import { ProductClassType, ProductType } from "@/libs/definations"
import { wait } from "@/libs/utils"
import { getStockAndPrices } from "./product/products/products.utils"


export async function getLatestProducts() {
    await wait()

    const getDate = (product: ProductType) => product.updateDate || product.createDate

    const products = await GET<ProductType>('products', { isDelete: false })
    const sortedProducts = products.sort((a, b) => {
        if (getDate(a) < getDate(b)) return 1
        if (getDate(a) > getDate(b)) return -1
        return 0
    })
    const latest = sortedProducts.slice(0, 5)
    const result: ProductType[] = []
    for await (const product of latest) {
        const productClasses = await GET<ProductClassType>('product_class', { product_id: product.id, isDelete: false })
        const { stockTotal, minPrice, maxPrice } = getStockAndPrices(productClasses)
        if (productClasses.length) {
            // product.classes = productClasses
            product.price = minPrice
            product.minPrice = minPrice
            product.maxPrice = maxPrice
            product.quantity = stockTotal
        }
        result.push(product)
    }
    return { lastDate: getDate(result[0]), products: result }
}
