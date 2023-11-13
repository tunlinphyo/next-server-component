'use client'

import Link from 'next/link'
import { ChildrenProp } from '@/libs/definations'
import clsx from 'clsx'
import styles from './button.module.css'

type LinkButtonProp = ChildrenProp & {
    href: string;
    theme?: 'default' | 'primary' | 'danger'
}

type LinkIconProp = ChildrenProp & {
    href: string;
    theme?: 'default' | 'primary'
}

type ButtonIconProp = ChildrenProp & {
    theme?: 'default' | 'primary'
}

export function LinkButton({ children, href, theme }: LinkButtonProp) {
    return (
        <Link href={href} className={clsx('button', theme)}>
            { children }
        </Link>
    )
}

export function LinkIcon({ children, href, theme }: LinkIconProp) {
    return (
        <Link href={href} className={clsx('button icon-button', theme)}>
            { children }
        </Link>
    )
}

export function ButtonIcon({ children, theme }: ButtonIconProp) {
    return (
        <button className={clsx('button icon-button', theme)}>
            { children }
        </button>
    )
}

export function ButtonSkeleton() {
    return (
        <div className={styles.buttonSkeleton}>#</div>
    )
}