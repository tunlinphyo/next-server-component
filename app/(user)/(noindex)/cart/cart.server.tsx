'use server'

import { isLogined } from "../../user.actions"
import { getCartData } from "./cart.actions"
import { CartForm, CartList } from "./cart.client"

export async function ServerCart() {
    const [ cartData, is ] = await Promise.all([
        getCartData(),
        isLogined()
    ])

    return (
        <>
            <CartList cart={cartData} />
            <CartForm isLogined={is} isCartItems={!!cartData.cartItems.length} />
        </>
    )
}
