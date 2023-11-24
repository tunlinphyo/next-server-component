'use client'

import styles from './related-products.module.css'
import { ProductWithPriceAndStock } from '../../product.interface'
import { Product, ProductSkeleton } from '../../products.client'
import { useXScroll } from './related-product.utils'

export function RelatedProducts({ id, products }: { id: number, products: ProductWithPriceAndStock[] }) {
    const { elemRef, handleScroll } = useXScroll(id)
    return (
        <div className={styles.relatedProducts}>
            <div ref={elemRef} className={styles.slideContainer} onScroll={handleScroll}>
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

export function RelatedProdcutSkeleton() {
    return (
        <div className={styles.relatedProducts}>
            <div className={styles.slideContainer}>
                <div className={styles.slideItem}>
                    <ProductSkeleton />
                </div>
                <div className={styles.slideItem}>
                    <ProductSkeleton />
                </div>
            </div>
        </div>
    )
}