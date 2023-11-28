import { CartItemWithDetail, CartWithItems } from "../../user/cart.interface"

export function useCartTotal(cart: CartWithItems) {
    const subtotal = cart.cartItems.reduce((acc: number, item: CartItemWithDetail) => {
        return acc + (item.productClass.price * item.quantity)
    }, 0)
    const shipping = 20

    return { subtotal, shipping }
}