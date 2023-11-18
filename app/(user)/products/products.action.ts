'use server'

import { getStockAndPrices } from "@/app/admin/(admin)/product/products/products.utils"
import { PER_PAGE } from "@/libs/const"
import { GET, QUERY } from "@/libs/db"
import { ProductClassType, ProductType, VariantType } from "@/libs/definations"
import { wait } from "@/libs/utils"
import { revalidatePath } from 'next/cache'
import { getUser } from "../user.actions"
import { createCartItem, getCart, getCartItem, updateCartItem } from "../cart.server"
import { getCookieCartItems, setCookieCartItems } from "../cookie.server"


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
    const user = await getUser()

    const class_id = Number(formData.get('class_id'))
    const pathname = String(formData.get('pathname'))

    console.log('PATH_NAME', pathname)

    if (user) {
        const cart = await getCart(user.id)
        try {
            const cartItem = await getCartItem(cart.id, class_id)
            if (cartItem) {
                await updateCartItem({ ...cartItem, quantity: cartItem.quantity + 1 })
            } else {
                await createCartItem(cart.id, class_id, 1)
            }
        } catch(error: any) {
            return { code: error.message }
        }
    } else {
        let carts = await getCookieCartItems()
        const is = carts.find(item => item.id == class_id)
        if (is) {
            carts = carts.map(item => {
                if (item.id == class_id) return { ...item, quantity: item.quantity + 1 }
                return item
            })
        } else {
            carts = [ ...carts, { id: class_id, quantity: 1 } ]
        }
        await setCookieCartItems(carts)
    }

    revalidatePath(pathname)
    return { code: 'Success!' }
}
