'use client'

import Image from 'next/image'
import styles from './image.module.css'
import { PhotoIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { ProductImage } from '@prisma/client'

export function ThumbnailImages({ images }: { images: ProductImage[] | undefined }) {
    if (!images || images?.length == 0) {
        return (
            <div className={styles.images}>
                <div className={styles.thumbImg}>
                    <PhotoIcon />
                </div>
            </div>
        )
    }
    const more = images.length - 4
    const list = images.slice(0, 4)
    return (
        <div className={styles.thumbImages}>
            {
                list.map(item => (
                    <Image
                        className={clsx(styles.thumbImg, styles.withImg)}
                        key={item.id}
                        src={item.imgUrl}
                        width={32}
                        height={32}
                        alt='image' />
                ))
            }
            {
                more > 0 && <div className={styles.thumbImg}>+{ more }</div>
            }
        </div>
    )
}

export function ThumbnailImage({ image }: { image: string | undefined }) {
    return (
        <div className={styles.images}>
            {
                image
                    ? <Image className={clsx(styles.thumbImg, styles.withImg)} src={image} width={32} height={32} alt='image' />
                    : <div className={styles.thumbImg}><PhotoIcon /></div>
            }
        </div>
    )
}
