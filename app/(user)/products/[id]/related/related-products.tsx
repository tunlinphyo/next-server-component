'use client'

import { Product } from '../../products.client'
import styles from './related-products.module.css'
import { ProductType } from "@/libs/definations"

export function RelatedProducts({ products }: { products: ProductType[] }) {
    return (
        <div className={styles.relatedProducts}>
            <div className={styles.slideContainer}>
                {
                    products.map((item) => (
                        <div className={styles.slideItem} key={item.id}>
                            <Product product={item} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}