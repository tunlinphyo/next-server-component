'use server'

import styles from './favourites.module.css'
import { getFavouriteProducts } from "../../account.actions"
import { RemoveFavouriteForm } from "./favourites.client"
import { EmptyCard } from '@/components/user/utils/utils.client';
import Link from 'next/link';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import EmptyImage from '@/app/assets/icons/empty.svg'
import { Product, ProductLi, Products } from '@/app/(user)/products/products.client'


export async function ServerFavouriteProducts({ id, page }: { id: number, page: number; }) {
    const products = await getFavouriteProducts(id, page)

    if (!products.length) return (
        <EmptyCard image={EmptyImage} text="No Products" >
            <Link href={`/products`} className="primary-button">
                Go to Products <ArrowPathIcon />
            </Link>
        </EmptyCard>
    )

    return (
        <Products>
            {
                products.map(product => (
                    <ProductLi key={product.id}>
                        <Product product={product} observeable>
                            <RemoveFavouriteForm customerId={id} productId={product.id} />
                        </Product>
                    </ProductLi>
                ))
            }
        </Products>
    )
}
