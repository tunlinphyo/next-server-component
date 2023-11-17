'use server'

import { wait } from "@/libs/utils"
import { CartIcon, NavigationList, UserLink } from "@/components/user/utils/utils.client"
import { UserNavType } from "@/libs/definations"
import { getCartItemCount, getUser, isLogined } from "./user.actions"

export async function ServerCartIcon() {
    const cartItemCount = await getCartItemCount()
    return (
        <CartIcon count={cartItemCount} />
    )
}

export async function ServerUser() {
    const user = await getUser()

    return (
        <UserLink user={user} />
    )
}

export async function ServerNavigation() {
    await wait()
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
        {
            href: '/account',
            name: 'Account',
        }
    ]
    return (
        <NavigationList navigations={navigations} />
    )
}