'use client'

import { PhotoIcon } from '@heroicons/react/24/outline'
import styles from './gallery.module.css'
import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ProductImage } from '@prisma/client'
import { useIntersectionObserver } from '@/libs/intersection-observer'

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
    const divRef = useRef<HTMLDivElement | null>(null)
    const [ current, setCurrent ] = useState(0)

    useEffect(() => {
        const { observe, unobserve } = useIntersectionObserver(divRef.current, entry => {
            entry.target.classList.toggle(styles.cardInview, entry.isIntersecting)
            if (entry.isIntersecting) {
                setCurrent(Number(entry.target.id))
            }
        }, 1)
        observe()

        return () => {
            unobserve()
        }
    }, [])

    return (
        <div className={styles.gallery}>
            <div ref={divRef} className={styles.galleryContainer}>
                {
                    images.map((img, index) => (
                        <div className={styles.galleryCard} key={index} id={String(index)}>
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
