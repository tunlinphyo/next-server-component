'use client'

import { ChildrenProp } from "@/libs/definations"
import styles from './dashboard.module.css'
import { TextSkeleton } from "@/components/admin/utils/utils.client";

type SummaryCardProps = ChildrenProp & {
    icon: any;
    title: string;
}

export function DashboardSummary({ children }: ChildrenProp) {
    return (
        <section className={styles.summaryContaineer}>
            { children }
        </section>
    )
}

export function DashboardSummaryCard({ children, icon, title }: SummaryCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                { icon } { title }
            </div>
            <div className={styles.cardBody}>
                { children }
            </div>
        </div>
    )
}

export function DashboardSummarySkileton() {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.iconSkileton} />
                <TextSkeleton fontSizeEm={.7} />
            </div>
            <div className={styles.cardBody}>
                <TextSkeleton fontSizeEm={.9} />
            </div>
        </div>
    )
}