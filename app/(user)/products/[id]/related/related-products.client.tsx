'use client'

import styles from './related-products.module.css'
import { ProductSkeleton } from '../../products.client'
import { useXScroll } from './related-product.utils'
import { useEffect } from 'react';
import { useIntersectionObserver } from '@/libs/intersection-observer';

export function RelatedProducts({ id, children, more }: { 
    id: number;
    children?: React.ReactNode;
    more?: React.ReactNode;
}) {
    const { elemRef, handleScroll } = useXScroll(id)

    useEffect(() => {
        const { observe, unobserve } = useIntersectionObserver(elemRef?.current, entry => {
            entry.target.classList.toggle("observer-inview", entry.isIntersecting)
        }, .25)
        observe()

        return () => {
            unobserve()
        }
    }, [])

    return (
        <div className={styles.relatedProducts}>
            <div ref={elemRef} className={styles.slideContainer} onScroll={handleScroll}>
                { children }
                { more }
            </div>
        </div>
    )
}

export function SlideItem({ children }: { children: React.ReactNode }) {
    return <div className={styles.slideItem}>{ children }</div>
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