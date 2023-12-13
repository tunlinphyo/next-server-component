'use server'

import { CartIcon, NavigationList, UserLink } from "@/components/user/utils/utils.client"
import { UserNavType } from "@/libs/definations"
import { getCartItemCount, getUser, isLogined } from "./user.actions"

export async function ServerCartIcon() {
    const cartItemCount = await getCartItemCount()
    return (
        <CartIcon count={cartItemCount || 0} />
    )
}

export async function ServerUser() {
    const user = await getUser()

    return (
        <UserLink user={user} />
    )
}

export async function ServerNavigation() {
    const is = await isLogined()

    const navigations: UserNavType[] = [
        {
            href: '/',
            name: 'Home',
        },
        {
            href: '/products',
            name: 'Products',
        },
        {
            href: '/cart',
            name: 'Cart',
        },
    ]

    if (is) {
        navigations.push({
            href: '/account',
            name: 'Account',
        })
    } else {
        navigations.push({
            href: '/login',
            name: 'Login',
        })
    }

    return (
        <NavigationList navigations={navigations} />
    )
}