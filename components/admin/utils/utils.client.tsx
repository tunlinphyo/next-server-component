'use client'

import { ChildrenProp } from '@/libs/definations'
import styles from './utils.module.css'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { formatDate } from '@/libs/utils'

type BudgeProps = ChildrenProp & {
    size?: 'default' | 'small' | 'large';
    theme?: 'default' | 'success' | 'danger';
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
    const getTheme = (theme: string | undefined) => {
        if (theme == "success") return styles.success 
        if (theme == "danger") return styles.danger 
        return null
    }
    return (
        <div className={clsx(styles.budge, getTheme(theme))}>
            { children }
        </div>
    )
}

export function DateTime({ date }: { date?: Date }) {
    if (!date) return null

    return (
        <span suppressHydrationWarning>
         { formatDate(date) }
        </span>
    )
}
