'use client'

import clsx from 'clsx'
import { Product } from '../products/products.client'
import styles from './home.module.css'
import { ProductType } from "@/libs/definations"
import Link from 'next/link'
import { ArrowRightIcon, TicketIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import IntroImg from '@/app/assets/icons/welcome.svg'

export function SearchBar() {
    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchBar}></div>
        </div>
    )
}

export function Categories() {
    const categories = [1,2,3,4,5,6]
    return (
        <div className={styles.categories}>
            <div className={styles.slideContainer}>
                {
                    categories.map(item => (
                        <div className={clsx(styles.slideItem, styles.categoryItem)} key={item}>
                            <Link href={`/products`} className={styles.category}>
                                <TicketIcon />
                                Category
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export function ProductSlide({ products }: { products: ProductType[] }) {

    return (
        <div className={styles.latestProducts}>
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
                {
                    products.map(item => (
                        <div className={styles.slideItem} key={item.id}>
                            <Product product={item} />
                        </div>
                    ))
                }
                <div className={clsx(styles.slideItem, styles.slideItemEnd)}>
                    <Link href="/products" className={styles.goButton}>
                        <ArrowRightIcon />
                    </Link>
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
                <div className={styles.slideItem}></div>
                <div className={styles.slideItem}></div>
                <div className={clsx(styles.slideItem, styles.slideItemEnd)}>
                    <Link href="/products" className={styles.goButton}>
                        <ArrowRightIcon />
                    </Link>
                </div>
            </div>
        </div>
    )
}