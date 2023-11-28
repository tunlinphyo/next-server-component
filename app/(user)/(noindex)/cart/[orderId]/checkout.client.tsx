'use client'

import clsx from "clsx"
import styles from "./checkout.module.css"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

export function ProgressBar({ step }: { step: number }) {
    return (
        <div className={styles.progressBar}>
            <div className={styles.progress}>
                <div className={clsx(styles.progressItem, styles.shipping)}>
                    { step > 1 ? <CheckCircleIcon /> : <div className={styles.step}>1</div> }
                    Shipping
                </div>
                <div className={clsx(styles.progressItem, styles.payment)}>
                    { step > 2 ? <CheckCircleIcon /> : <div className={styles.step}>2</div> }
                    Payment
                </div>
                <div className={clsx(styles.progressItem, styles.review)}>
                    { step > 3 ? <CheckCircleIcon /> : <div className={styles.step}>3</div> }
                    Review
                </div>
            </div>
        </div>
    )
}

export function FooterBar({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    return (
        <footer className={styles.checkoutFooter}>
            <button className={styles.backButton} onClick={() => router.back()}>
                <ArrowLeftIcon />
            </button>
            { children }
        </footer>
    )
}