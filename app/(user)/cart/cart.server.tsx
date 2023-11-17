'use server'

import { isLogined } from "../user.actions"
import { getCart } from "./cart.actions"
import { CartForm, CartList } from "./cart.client"

export async function ServerCart() {
    const [ cartItems, is ] = await Promise.all([
        getCart(),
        isLogined()
    ])

    return (
        <>
            <CartList list={cartItems} />
            <CartForm isLogined={is} isCartItems={!!cartItems.length} />
        </>
    )
}
