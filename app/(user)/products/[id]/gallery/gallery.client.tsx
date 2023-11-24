'use client'

import { PhotoIcon } from '@heroicons/react/24/outline'
import styles from './gallery.module.css'
import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'
import { ProductImage } from '@prisma/client'

export function ImageGallery({ images }: { images?: ProductImage[] }) {
    if (!images || !images.length) return (
        <div className={styles.galleryContainer}>
            <div className={styles.galleryCard}>
                <div className={clsx(styles.image, styles.noImage)}>
                    <PhotoIcon />
                </div>
            </div>
        </div>
    )
    const [ current, setCurrent ] = useState(0)

    const handleScroll = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement
        const scrollX = target.scrollLeft
        const activeIndex = Math.round(scrollX / target.clientWidth)
        if (activeIndex != current) {
            setCurrent(activeIndex)
        }
    }

    return (
        <div className={styles.gallery}>
            <div className={styles.galleryContainer} onScroll={handleScroll}>
                {
                    images.map((img, index) => (
                        <div className={styles.galleryCard} key={index}>
                            <div className={styles.image}>
                                <Image
                                    src={img.imgUrl}
                                    alt="product image"
                                    width={400}
                                    height={400}
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
            <ul className={styles.bulletContainer}>
                {
                    images.map((item, index) => (
                        <li 
                            key={index} 
                            className={clsx(styles.bullet, index === current && styles.activeBullet)} 
                        />
                    ))
                }
            </ul>
        </div>
    )
}

export function GallerySkeleton() {
    return (
        <div className={styles.galleryContainer}>
            <div className={styles.galleryCard}>
                <div className={clsx(styles.image, styles.noImage)}>
                    <PhotoIcon />
                </div>
            </div>
        </div>
    )
}
