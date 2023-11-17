'use client'

import { ChildrenProp, UserNavType, UserType } from '@/libs/definations'
import styles from './utils.module.css'
import { ArrowLeftOnRectangleIcon, Bars3BottomLeftIcon, ShoppingBagIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

type PageHeaderProps = ChildrenProp & {
    navigations: React.ReactNode;
}

type NavigationsProps = ChildrenProp & {
    toggle: boolean;
}

type EmptyCartProps = {
    image: string;
    text: string;
    children?: React.ReactNode;
}

export function PageContainer({ children }: ChildrenProp) {
    return (
        <div className={styles.page}>
            { children }
        </div>
    )
}

export function PageHeader({ children, navigations }: PageHeaderProps) {
    const [ toggle, setToggle ] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setToggle(false)
    }, [ pathname ])

    return (
        <header className={styles.header}>
            <button className={styles.menuButton} onClick={() => setToggle(!toggle)}>
                { toggle ? <XMarkIcon /> : <Bars3BottomLeftIcon />}
            </button>
            <div className={styles.headerActions}>
                <div className={styles.logo}>
                    <Link href="/">Shoppy</Link>
                </div>
                { children }
            </div>
            <Navigations toggle={toggle}>
                { navigations }
            </Navigations>
        </header>
    )
}

export function PageTitle({ title }: { title: string }) {
    return (
        <h1 className={styles.pageTitle}>{ title }</h1>
    )
}

export function PageFooter() {
    return (
        <footer className={styles.pageFooter}>
            &copy; 2023
        </footer>
    )
}

export function Navigations({ children, toggle }: NavigationsProps) {
    return (
        <nav className={clsx(styles.navigation, toggle && styles.navigationOpen)}>
            { children }
        </nav>
    )
}

export function NavigationList({ navigations }: { navigations: UserNavType[] }) {
    return (
        <ul className={styles.navList}>
            {
                navigations.map(item => (
                    <li key={item.href} className={styles.navItem}>
                        <Link href={item.href} className={styles.nav}>{ item.name }</Link>
                    </li>
                ))
            }
        </ul>
    )
}

export function CartIcon({ count }: { count: number }) {
    return (
        <Link href="/cart" className={styles.cartIcon}>
            { !!count && <span className={styles.cartBadge}>{ count }</span> }
            <ShoppingBagIcon />
        </Link>
    )
}

export function UserLink({ user }: { user?: UserType }) {
    return (
        user ? (
            <Link href="/account" className={clsx(styles.userIcon, styles.withUser)}>
                <UserIcon />
            </Link>
        ) : (
            <Link href="/login" className={styles.userIcon}>
                <ArrowLeftOnRectangleIcon />
            </Link>
        )
    )
}

export function EmptyCard({ image, text, children }: EmptyCartProps) {
    return (
        <div className={styles.emptyContainer}>
            <div className={styles.emptyCard}>
                <div className={styles.emptyImage}>
                    <Image
                        src={image}
                        alt={text}
                        width={200}
                        height={200}
                    />
                </div>
                <div className={styles.emptyMessage}>
                    { text }
                </div>
                {
                    !!children && (
                        <div className={styles.extraLink}>
                            { children }
                        </div>
                    )
                }
            </div>
        </div>
    )
}


export function NavigationSkeleton() {
    return (
        <ul className={styles.navList}>
            <li className={styles.navItem}>
                <div className={styles.navSkeleton} style={{ width: '4ch' }} />
            </li>
            <li className={styles.navItem}>
                <div className={styles.navSkeleton} style={{ width: '8ch' }} />
            </li>
            <li className={styles.navItem}>
                <div className={styles.navSkeleton} style={{ width: '4ch' }} />
            </li>
            <li className={styles.navItem}>
                <div className={styles.navSkeleton} style={{ width: '7ch' }} />
            </li>
        </ul>
    )
}

export function CartIconSkeleton() {
    return (
        <div className={styles.cartIcon}>
            <div className={styles.cartIconSkeleton} />
        </div>
    )
}

export function UserLinkSkeleton() {
    return (
        <div className={clsx(styles.userIcon, styles.userIconSkeleton)} />
    )
}

export function TextSkeleton({ width, fontSizeEm, bgColor, top }: { width?: number, fontSizeEm?: number, bgColor?: string, top?: number }) {
    return (
        <div
            className={styles.textSkeleton}
            style={{
                width: `${width ?? 80}px`,
                fontSize: `${fontSizeEm ?? 1}rem`,
                backgroundColor: `${bgColor ?? 'var(--foreground-50)'}`,
                marginTop: `${top || 0}px`
            }}
        >
            #
        </div>
    )
}
