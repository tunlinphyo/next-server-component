'use client'

import Link from "next/link"
import { Navigation } from "./navigation.types"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import styles from './navigation.module.css'
import { handleSignOut } from "@/app/admin/auth.actions"
import { ArrowRightOnRectangleIcon, CubeIcon, HomeIcon, ShoppingCartIcon, UserGroupIcon, UsersIcon } from "@heroicons/react/24/outline"

export function Nav({ nav }: { nav: Navigation }) {
    const pathname = usePathname()

    const getIcon = (icon: string) => {
        switch (icon) {
            case 'Users':
                return <UserGroupIcon />
            case 'Customers':
                return <UsersIcon />
            case 'Product':
                return <CubeIcon />
            case 'Order':
                return <ShoppingCartIcon />
            default:
                return <HomeIcon />
        }
    }

    const isActive = () => {
        if (nav.href === '/admin' && pathname === '/admin') return true
        else if (nav.href !== '/admin' && pathname.startsWith(nav.href)) return true
        return false
    }

    return (
        <li key={nav.href} className={clsx(isActive() && styles.active)}>
            <Link href={nav.href}>
                { getIcon(nav.name) }
                { nav.name }
            </Link>
        </li>
    )
}

export function Logout() {
    return (
        <li>
            <form action={handleSignOut}>
                <button className={clsx(styles.logout, styles.overwrite)}>
                    <ArrowRightOnRectangleIcon />
                    Logout
                </button>
            </form>
        </li>
    )
}