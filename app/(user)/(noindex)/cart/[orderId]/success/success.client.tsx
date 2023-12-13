'use client'

import Link from 'next/link'
import styles from './success.module.css'
import { GiftIcon } from '@heroicons/react/24/outline'

export function Success({ orderId }: { orderId: number }) {
    return (
        <div className={styles.success}>
            <div className={styles.successContainer}>
                <h4>Order Successful!</h4>
                <div className={styles.orderId}>Order ID: { orderId }</div>
                <Link href="/products" className="primary-button fill">
                    Continue Shopping
                    <GiftIcon />
                </Link>
            </div>
        </div>
    )
}