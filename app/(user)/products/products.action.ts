'use server'

import { getStockAndPrices } from "@/app/admin/(admin)/product/products/products.utils"
import { PER_PAGE } from "@/libs/const"
import { GET, QUERY } from "@/libs/db"
import { CookieCartType, ProductClassType, ProductType, VariantType } from "@/libs/definations"
import { wait } from "@/libs/utils"
import { revalidatePath } from 'next/cache';
import { cookies } from "next/headers"
import { COOKIE_CART } from "../user.const"


export async function getProductPageLength(query: string) {
    await wait()

    const q = query || ''
    const options = { name: q, description: q }

    const products = await QUERY<ProductType>('products', options)
    return Math.ceil(products.length / PER_PAGE)
}

export async function getProducts(page: number, query: string ) {
    await wait()

    const q = query || ''
    const options = { name: q, description: q }

    const products = await QUERY<ProductType>('products', options)
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const end = start + PER_PAGE
    const sortedProducts = products.sort((a, b) => {
        if (a.createDate < b.createDate) return 1
        if (a.createDate > b.createDate) return -1
        return 0
    })
    const paginated = sortedProducts.slice(start, end)
    const result: ProductType[] = []

    const variants = await GET<VariantType>('product_variants', { isDelete: false })

    for await (const product of paginated) {
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
        result.push(product)
    }
    return result
}

export async function addToCart(prevState: any, formData: FormData) {
    await wait()

    const id = Number(formData.get('class_id'))

    // CHECK_USER_LOGIN
    // IF LOGIN Set cart item to DB

    // ELSE Set to Cookie
    const cookieStore = cookies()
    const cookieCart = cookieStore.get(COOKIE_CART)

    let carts: CookieCartType[] = cookieCart?.value ? JSON.parse(cookieCart.value) : []
    const is = carts.find(item => item.id == id)
    if (is) {
        carts = carts.map(item => {
            if (item.id == id) return { ...item, quantity: item.quantity + 1 }
            return item
        })
    } else {
        carts = [ ...carts, { id, quantity: 1 } ]
    }

    console.log('ADD_TO_CART', carts, id)
    cookieStore.set(COOKIE_CART, JSON.stringify(carts))

    revalidatePath('/products')
    return { code: 'Success!' }
}
