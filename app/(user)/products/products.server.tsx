'use server'

import { FavouriteSkeleton, FavouriteToggleForm, Product, ProductLi, Products } from "./products.client"
import { getProducts } from "./products.action"
import { Suspense } from "react"
import { getUser } from "../user.actions"
import { EmptyCard } from '@/components/user/utils/utils.client'
import EmptyImage from '@/app/assets/icons/empty.svg'
import Link from 'next/link'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import prisma from '@/libs/prisma'
import { wait } from "@/libs/utils"

export async function ServerProducts({ page, query, categoryId }: { page: number; query: string; categoryId?: number }) {
    const user = await getUser()
    // await wait(3000)
    const products = await getProducts(page, query, categoryId)

    if (!products.length) return (
        <EmptyCard image={EmptyImage} text="No Products" >
            <Link href={`/products`} className="primary-button">
                Clear Filters <ArrowPathIcon />
            </Link>
        </EmptyCard>
    )
    return (
        <Products>
            {
                products.map(product => (
                    <ProductLi key={product.id}>
                        <Product product={product}>
                            <Suspense fallback={<FavouriteSkeleton />}>
                                <ServerFavourite customerId={user?.id} productId={product.id} />
                            </Suspense>
                        </Product>
                    </ProductLi>
                ))
            }
        </Products>
    )
}

export async function ServerFavourite({ customerId, productId }: { customerId?: number, productId: number; }) {
    if (!customerId) return null
    // await wait(3000)
    const is = await prisma.customerFavourite.findUnique({
        where: { 
            customerId_productId: {
                customerId,
                productId,
            }
        }
    })
    return (
        <FavouriteToggleForm customerId={customerId} productId={productId} is={!!is} />
    )
}