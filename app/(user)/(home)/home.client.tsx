'use client'

import clsx from 'clsx'
import { Product } from '../products/products.client'
import styles from './home.module.css'
import Link from 'next/link'
import { ArrowRightIcon, TicketIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import IntroImg from '@/app/assets/icons/welcome.svg'
import { useToast } from '@/components/user/toast/toast.index'
import { ProductWithPriceAndStock } from '@/app/admin/(admin)/product/products/products.interface'
import { Category } from '@prisma/client'
import { useXScroll } from './home.utils'
import { useEffect } from 'react'
import { useIntersectionObserver } from '@/libs/intersection-observer'

export function SearchBar() {
    const { showToast } = useToast()

    const handleClick = () => {
        showToast("TOAST TEST")
    }
    return (
        <div className={styles.searchContainer} onClick={handleClick}>
            <div className={styles.searchBar}></div>
        </div>
    )
}

export function Categories({ categories }: { categories: Category[] }) {
    return (
        <div className={styles.categories}>
            <div className={styles.slideContainer}>
                {
                    categories.map(item => (
                        <div className={clsx(styles.slideItem, styles.categoryItem)} key={item.id}>
                            <Link href={`/products?category=${item.id}`} className={styles.category}>
                                <TicketIcon />
                                { item.name }
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export function ProductSlide({ children }: { children: React.ReactNode }) {
    const { elemRef, handleScroll } = useXScroll()

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
        <div className={styles.latestProducts}>
            <div ref={elemRef} className={styles.slideContainer} onScroll={handleScroll}>
                <div className={clsx(styles.slideItem, styles.slideItemStart)}>
                    <div className={styles.introCard}>
                        <div className={styles.introMedia}>
                            <Image src={IntroImg} width={200} height={150} alt='intro' />
                        </div>
                        <div className={styles.introMessage}>
                            <span>Discover Joy </span>in Every Cart – Your One-Stop Shop for Style, Savings, and Smiles!
                        </div>
                    </div>
                </div>
                { children }
                <div className={clsx(styles.slideItem, styles.slideItemEnd)}>
                    <Link href="/products?order=latest" className={styles.goButton}>
                        <ArrowRightIcon />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export function CategorySkeleton() {
    return (
        <div className={clsx(styles.categories, "skeleton")}>
            <div className={styles.slideContainer}>
                <div className={clsx(styles.slideItem, styles.categoryItem, styles.categoryItemSkeleton)}>
                    <div className={styles.category} />
                </div>
                <div className={clsx(styles.slideItem, styles.categoryItem, styles.categoryItemSkeleton)}>
                    <div className={styles.category} />
                </div>
                <div className={clsx(styles.slideItem, styles.categoryItem, styles.categoryItemSkeleton)}>
                    <div className={styles.category} />
                </div>
            </div>
        </div>
    )
}

export function ProductSlideSkeleton() {
    return (
        <div className={clsx(styles.latestProducts, "skeleton")}>
            <div className={styles.slideContainer}>
                <div className={clsx(styles.slideItem, styles.slideItemStart)}>
                    <div className={styles.introCard}>
                        <div className={styles.introMedia}>
                            <Image src={IntroImg} width={200} height={150} alt='intro' />
                        </div>
                        <div className={styles.introMessage}>
                            <span>Discover Joy </span>in Every Cart – Your One-Stop Shop for Style, Savings, and Smiles!
                        </div>
                    </div>
                </div>
                <div className={clsx(styles.slideItem, styles.itemSkeleton)}></div>
                <div className={clsx(styles.slideItem, styles.itemSkeleton)}></div>
                <div className={clsx(styles.slideItem, styles.slideItemEnd)}>
                    <Link href="/products" className={styles.goButton}>
                        <ArrowRightIcon />
                    </Link>
                </div>
            </div>
        </div>
    )
}