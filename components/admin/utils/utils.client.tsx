'use client'

import { ChildrenProp } from '@/libs/definations'
import styles from './utils.module.css'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

type BudgeProps = ChildrenProp & {
    size?: 'default' | 'small' | 'large';
    theme?: 'default' | 'primary' | 'danger';
}

export function PageContainer({ children }: ChildrenProp) {
    return (
        <div className={styles.pageScroll}>
            <div className={styles.page}>
                { children }
            </div>
        </div>
    )
}

export function FlexBetween({ children }: ChildrenProp) {
    return (
        <div className={styles.flexBetween}>
            { children }
        </div>
    )
}

export function BackHeader() {
    const router = useRouter()
    const back = () => {
        router.back()
    }
    return (
        <div className={styles.backHeader}>
            <ChevronLeftIcon className={styles.backIcon} />
            <button onClick={back}>Back</button>
        </div>
    )
}

export function TextSkeleton({ width, fontSizeEm, bgColor }: { width?: number, fontSizeEm?: number, bgColor?: string }) {
    return (
        <div
            className={styles.textSkeleton}
            style={{
                width: `${width ?? 80}px`,
                fontSize: `${fontSizeEm ?? 1}rem`,
                backgroundColor: `${bgColor ?? 'var(--foreground-50)'}`
            }}
        >
            #
        </div>
    )
}

export function Budge({ children, size, theme }: BudgeProps) {
    return (
        <div className={clsx(styles.budge)}>
            { children }
        </div>
    )
}
