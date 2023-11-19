'use server'

import { isLogined } from "../../user.actions"
import { getCartData } from "./cart.actions"
import { CartForm, CartList } from "./cart.client"

export async function ServerCart() {
    const [ cartData, is ] = await Promise.all([
        getCartData(),
        isLogined()
    ])
    const { cart, cartItems, errors } = cartData

    return (
        <>
            <CartList cart={cart} list={cartItems} />
            <CartForm isLogined={is} isCartItems={!!cartItems.length} />
        </>
    )
}
