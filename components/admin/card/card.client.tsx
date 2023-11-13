'use client'

import { ChildrenProp } from "@/libs/definations"
import styles from './card.module.css'
import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { TextSkeleton } from "../utils/utils.client";
import clsx from 'clsx';

type SummaryCard = {
    icon: any;
    title: string;
    href: string;
    count:number;
}

export function Summary({ children }: ChildrenProp) {
    return (
        <section className={styles.summary}>
            { children }
        </section>
    )
}

export function SummaryCard({ icon, title, href, count }: SummaryCard) {
    return (
        <div className={styles.summaryCard}>
            <header className={styles.summaryCardHeader}>
                { icon } <span>{ count }</span>
            </header>
            <div className={styles.summaryCardTitle}>{ title }</div>
            <footer className={styles.summaryCardFooter}>
                <Link href={href}>
                    Manage { title }
                    <ArrowLongRightIcon />
                </Link>
            </footer>
        </div>
    )
}

export function SummaryCardSkeleton() {
    return (
        <div className={styles.summaryCard}>
            <header className={styles.summaryCardHeader}>
                <div className={styles.summaryCardIconSkeleton} />
            </header>
            <div className={styles.summaryCardTitle}>
                <TextSkeleton fontSizeEm={1.2} />
            </div>
            <footer className={clsx(styles.summaryCardFooter, styles.summaryCardFooterSkeleton)}>
                <TextSkeleton fontSizeEm={.8} width={120} />
            </footer>
        </div>
    )
}