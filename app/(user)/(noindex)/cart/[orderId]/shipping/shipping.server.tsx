"use server"

import { getUser } from "@/app/(user)/user.actions"
import { getCart } from "@/app/(user)/user/cart.server"
import { redirect } from "next/navigation"

export async function ServerShipping() {
    const user = await getUser() 
    if (!user) redirect("/cart")
    const cart = await getCart(user.id)

    console.log('CART_______', cart)

    return (
        <div>CHECKOUT FORM</div>
    )
}