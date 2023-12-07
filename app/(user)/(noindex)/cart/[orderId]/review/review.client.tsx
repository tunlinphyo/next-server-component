'use client'

import { formatPrice } from '@/libs/utils'
import { FooterBar, OrderSummary, SummaryData, SummaryRow } from '../checkout.client'
import { CustomerPaymentWithPayment, OrderItemWidthDetail, OrderWithPaymentAndAddress } from '../checkout.interface'
import styles from './review.module.css'
import { CodCard, CreditCard } from '../payment/payment.client'
import Link from 'next/link'
import Image from 'next/image'
import { PencilSquareIcon, PhotoIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { FormCreatButton } from '@/components/user/form/form.client'
import { formatAddress } from '@/app/(user)/user/user.utils'
import { PageSubTitle } from '@/components/user/utils/utils.client'
import { useFormState } from 'react-dom'
import { onCheckout } from '../checkout.actions'
import { useToast } from '@/components/user/toast/toast.index'
import { useEffect } from 'react'

export function ReviewForm({ order, children, card }: {
    order: OrderWithPaymentAndAddress;
    children: React.ReactNode;
    card: React.ReactNode
}) {
    const [ state, onAction ] = useFormState(onCheckout, { message: '' })
    const { showToast } = useToast()

    useEffect(() => {
        if (state.message) showToast(state.message)
    }, [ state ])

    return (
        <form action={onAction}>
            <input type="hidden" name="orderId" defaultValue={order.id} />
            <PageSubTitle title="Shipping" />
            <OrderSummary>
                <div className={styles.cardActions}>
                    <Link className={styles.orderEdit} href={`/cart/${order.id}/shipping`}>
                        <PencilSquareIcon />
                    </Link>
                </div>
                <SummaryData label="Name">{ order.name }</SummaryData>
                <SummaryData label="Email">{ order.email }</SummaryData>
                <SummaryData label="Phone">{ order.phone }</SummaryData>
                <SummaryData label="Address">{ formatAddress(order.address) }</SummaryData>
                <SummaryData label="Message">{ order.note }</SummaryData>
            </OrderSummary>
            <PageSubTitle title="Payment" />
            { children }
            <OrderSummary>
                <SummaryRow label="Subtotal" value={formatPrice(order.subTotal)} />
                <SummaryRow label="Shipping" value={formatPrice(order.deliveryAmount)} />
                <SummaryRow label="Total" value={formatPrice(order.totalAmount)} />
                { card }
                <SummaryRow label="Pay" value={ formatPrice(order.totalAmount) } large />
            </OrderSummary>
            <FooterBar>
                <FormCreatButton icon={<ShoppingCartIcon />}>
                    Checkout
                </FormCreatButton>
            </FooterBar>
        </form>
    )
}

export function OrderItems({ orderItems }: { orderItems: OrderItemWidthDetail[] }) {
    return (
        <ul className={styles.orderItems}>
            {
                orderItems.map(item => (
                    <OrderItem item={item} key={item.id} />
                ))
            }
        </ul>
    )
}

export function OrderItem({ item }: { item: OrderItemWidthDetail }) {
    const product = item.product
    const productClass = item.productClass
    return (
        <Link href={`/products/${product.id}`} className={styles.orderItem}>
            <div className={styles.productImage}>
                {
                    (product.images && product.images.length)
                        ? <Image src={product.images[0].imgUrl} width={200} height={200} alt='product image' />
                        : <PhotoIcon />
                    }
            </div>
            <div className={styles.productDetail}>
                <div style={{ width: '100%', flex: 1 }}>
                    <h4>{ product.name }</h4>
                    <p className={styles.productClass}>
                        { productClass.variant1?.name } { !!productClass.variant2 && ' - ' } { productClass.variant2?.name }
                    </p>
                    <small className={styles.productPrice}>{ formatPrice(productClass.price) } x { item.quantity }</small>
                </div>
                <div className={styles.totalPrice}>{ formatPrice(productClass.price * item.quantity) }</div>
            </div>
        </Link>
    )
}

export function CardData({ orderId, customerPayment }: { orderId: number; customerPayment: CustomerPaymentWithPayment }) {
    return (
        <div className={styles.cardContainer}>
            {
                customerPayment.payment.isCredit ? (
                    <CreditCard payment={customerPayment} mini>
                        <Link className={styles.orderEdit} href={`/cart/${orderId}/payment`}>
                            <PencilSquareIcon />
                        </Link>
                    </CreditCard>
                ) : (
                    <CodCard mini>
                        <Link className={styles.orderEdit} href={`/cart/${orderId}/payment`}>
                            <PencilSquareIcon />
                        </Link>
                    </CodCard>
                )
            }
        </div>
    )
}