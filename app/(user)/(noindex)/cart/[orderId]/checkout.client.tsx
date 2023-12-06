'use client'

import clsx from "clsx"
import styles from "./checkout.module.css"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import { ChildrenProp } from "@/libs/definations"

export function ProgressBar({ step }: { step: number }) {
    return (
        <div className={styles.progressBar}>
            <div className={styles.progress}>
                <div className={clsx(styles.progressItem, styles.shipping, step == 1 && styles.active)}>
                    { step > 1 ? <CheckCircleIcon /> : <div className={styles.step}>1</div> }
                    Shipping
                </div>
                <div className={clsx(styles.progressItem, styles.payment, step == 2 && styles.active)}>
                    { step > 2 ? <CheckCircleIcon /> : <div className={styles.step}>2</div> }
                    Payment
                </div>
                <div className={clsx(styles.progressItem, styles.review, step == 3 && styles.active)}>
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
            <button type="button" className={styles.backButton} onClick={() => router.back()}>
                <ArrowLeftIcon />
            </button>
            { children }
        </footer>
    )
}

export function OrderSummary({ children }: ChildrenProp) {
    return (
        <div className={styles.orderSummary}>
            <div className={styles.orderSummaryContainer}>
                { children }
            </div>
        </div>
    )
}

export function SummaryData({ label, children }: { label: string; children: React.ReactNode; }) {
    return (
        <div className={clsx(styles.summaryData)}>
            <div className={styles.summaryDataLabel}>{ label }</div>
            <div className={styles.summaryDataValue}>{ children }</div>
        </div>
    )
}

export function SummaryRow({ label, value, large }: { label: string; value: string; large?: boolean; }) {
    return (
        <div className={clsx(styles.summaryFlex, large && styles.large)}>
            <div className={styles.summaryLabel}>{ label }</div>
            <div className={styles.summaryValue}>{ value }</div>
        </div>
    )
}