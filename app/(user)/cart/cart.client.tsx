'use client'

import Link from 'next/link'
import styles from './cart.module.css'
import { CartItemType, CartType } from "@/libs/definations"
import Image from 'next/image'
import { ArrowLongRightIcon, ArrowPathIcon, ArrowRightOnRectangleIcon, MinusIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '@/libs/utils'
import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { decreaseQuantity, deleteCartItem, increaseQuantity } from './cart.actions'
import { appToast } from '@/libs/toasts'
import { EmptyCard, TextSkeleton } from '@/components/user/utils/utils.client'
import clsx from 'clsx'
import { usePathname, useSearchParams } from 'next/navigation'
import EmptyImage from '@/app/assets/icons/empty.svg'

export function CartForm({ isLogined, isCartItems }: { isLogined: boolean, isCartItems: boolean }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    if (!isCartItems) return null

    if (!isLogined) {
        const params = new URLSearchParams(searchParams)
        params.set("callback_url", pathname)
        return (
            <div className={styles.formButtonContainer}>
                <div className={styles.fixButton}>
                    <Link href={`/login?${params.toString()}`} className="primary-button">
                        Login to Checkout <ArrowRightOnRectangleIcon />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <form className={styles.checkoutForm}>
            <h4>Checkout</h4>
            <div>Comming soon..</div>
        </form>
    )
}

export function CartList({ cart, list }: { cart?: CartType, list: CartItemType[] }) {

    if (!list.length) return (
        <EmptyCard image={EmptyImage} text="Empty Cart">
            <Link href="/products" className="primary-button">
                Go to Products <ArrowLongRightIcon />
            </Link>
        </EmptyCard>
    )

    return (
        <ul className={styles.cartList}>
            {
                list.map(item => (
                    <li key={item.id}>
                        <CartItem item={item} />
                    </li>
                ))
            }
        </ul>
    )
}

export function CartItem({ item }: { item: CartItemType }) {
    const product = item.product
    const productClass = item.productClass
    return (
        <div className={styles.cartItem}>
            <Link href={`/products/${product.id}`} className={styles.productImage}>
                {
                    (product.images && product.images.length)
                        ? <Image src={product.images[0]} width={200} height={200} alt='product image' />
                        : <PhotoIcon />
                    }
            </Link>
            <div className={styles.productDetail}>
                <Link href={`/products/${product.id}`} style={{ width: '100%', flex: 1 }}>
                    <h4>{ product.name }</h4>
                    <p className={styles.productClass}>
                        { productClass.variant1?.name } { !!productClass.variant2 && ' - ' } { productClass.variant2?.name }
                    </p>
                    <small className={styles.productPrice}>{ formatPrice(productClass.price) }</small>
                </Link>
                <QuantityControl
                    id={productClass.id}
                    quantity={item.quantity}
                    max={productClass.quantity}
                />
            </div>
            <DeleteForm id={productClass.id} />
        </div>
    )
}

export function QuantityControl({ id, quantity, max }: { id: number; quantity: number; max: number }) {
    return (
        <div className={styles.quantityControl}>
            <DecreaseFrom id={id} quantity={quantity} />
            <div
                className={styles.quantity}>
                { quantity }
            </div>
            <IncreaseFrom id={id} quantity={quantity} max={max} />
        </div>
    )
}

const initState = {
    code: ''
}

export function IncreaseFrom({ id, quantity, max }: { id: number; quantity: number; max: number }) {
    const [ state, onAction ] = useFormState(increaseQuantity.bind(null, id), { code: '' })

    useEffect(() => {
        if (state.code) appToast(state.code)
    }, [ state ])

    return (
        <form action={onAction}>
            <QtyButton icon={<PlusIcon />} disabled={quantity == max} />
        </form>
    )
}

export function DecreaseFrom({ id, quantity }: { id: number; quantity: number }) {
    const [ state, onAction ] = useFormState(decreaseQuantity.bind(null, id), { code: '' })

    useEffect(() => {
        if (state.code) appToast(state.code)
    }, [ state ])

    return (
        <form action={onAction}>
            <QtyButton icon={<MinusIcon />} disabled={quantity == 1} />
        </form>
    )
}

export function DeleteForm({ id }: { id: number }) {
    // const [ state, onAction ] = useFormState(deleteCartItem.bind(null, id), { code: '' })

    // useEffect(() => {
    //     if (state.code) appToast(state.code)
    // }, [ state ])

    return (
        <form action={deleteCartItem.bind(null, id)}>
            <DelButton />
        </form>
    )
}

export function QtyButton({ icon, disabled }: { icon: any; disabled: boolean }) {
    const { pending } = useFormStatus()
    return (
        <button className={styles.qtyButton} disabled={pending || disabled}>
            { pending ? <ArrowPathIcon className="icon-loading" /> : icon }
        </button>
    )
}

export function DelButton() {
    const { pending } = useFormStatus()
    return (
        <button className={styles.deleteItem} disabled={pending}>
            { pending ? <ArrowPathIcon className="icon-loading" /> : <TrashIcon /> }
        </button>
    )
}

export function CartSkeleton({ count }: { count: number }) {
    const list = new Array(count).fill(1)
    return (
        <ul className={styles.cartList}>
            {
                list.map((item, index) => (
                    <li key={index}>
                        <div className={clsx(styles.cartItem, 'skeleton')}>
                            <div className={styles.productImage}>
                                <PhotoIcon />
                            </div>
                            <div className={styles.productDetail}>
                                <div style={{ width: '100%', flex: 1 }}>
                                    <TextSkeleton fontSizeEm={.9} width={80} />
                                    <TextSkeleton fontSizeEm={.8} width={120} top={5} />
                                    <TextSkeleton fontSizeEm={.7} top={5} />
                                </div>
                            </div>
                            <div className={clsx(styles.deleteItem, styles.deleteSkeleton)} />
                        </div>
                    </li>
                ))
            }
        </ul>
    )
}
