"use client"

import styles from './payment.module.css'
import { CustomerPaymentWithPayment, OrderWithPaymentAndAddress } from '../checkout.interface';
import clsx from 'clsx'
import { formatPrice, mapRange } from '@/libs/utils'
import Link from 'next/link'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { ArrowRightCircleIcon, CheckIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { FooterBar, OrderSummary, SummaryRow } from '../checkout.client'
import { FormCreatButton } from '@/components/user/form/form.client'
import { useFormState } from 'react-dom'
import { onPayment } from '../checkout.actions'
import { useToast } from '@/components/user/toast/toast.index'

type PaymentFormProps = {
    order: OrderWithPaymentAndAddress;
    payments: CustomerPaymentWithPayment[];
    customerId: number;
    children: React.ReactNode;
}

let initState: CustomerPaymentWithPayment | undefined

const PaymentContext = createContext(initState)

export function PaymentForm({ order, payments, customerId, children }: PaymentFormProps) {
    const [ payment, setPayment ] = useState(getPayment(order.customerPaymentId))
    const handleChange = (value: string) => {
        setPayment(getPayment(Number(value)))
    }

    function getPayment(id: number | null) {
        return payments.find(item => item.id === Number(id))
    }
    return (
        <>
            <PaymentSlide orderId={order.id} payments={payments} defaultValue={payment?.id} onChange={e => handleChange(e.target.value)} />
            <PaymentContext.Provider value={payment}>
                { children }
            </PaymentContext.Provider>
        </>
    )
}

export function OrderSummaryCard({ order }: { order: OrderWithPaymentAndAddress; }) {
    const payment = useContext(PaymentContext)
    const [ state, onAction ] = useFormState(onPayment, { message: '' })
    const { showToast } = useToast()

    useEffect(() => {
        if (state.customerPaymentId) showToast(state.customerPaymentId)
        if (state.message) showToast(state.message)
    }, [ state ])

    return (
        <form action={onAction}>
            <input type="hidden" name="orderId" defaultValue={order.id} />
            <input type="hidden" name="customerId" defaultValue={payment?.customerId} />
            <input type="hidden" name="customerPaymentId" defaultValue={payment?.id} />
            <input type="hidden" name="paymentId" defaultValue={payment?.paymentId} />
            {
                !payment && (
                    <div className={styles.errorMessage}>Please select a payment!</div>
                )
            }
            <OrderSummary>
                <SummaryRow label="Subtotal" value={formatPrice(order.subTotal)} />
                <SummaryRow label="Estimated shipping" value={formatPrice(order.deliveryAmount)} />
                <SummaryRow label="Total" value={formatPrice(order.totalAmount)} />
                <SummaryRow label="Payment Type" value={payment?.payment.name || ''} />
                <SummaryRow label="Pay" value={ payment ? formatPrice(order.totalAmount) : '' } large />
            </OrderSummary>
            <FooterBar>
                <FormCreatButton icon={<ArrowRightCircleIcon />}>
                    Review
                </FormCreatButton>
            </FooterBar>
        </form>
    )
}

export function PaymentSlide({ orderId, payments, defaultValue, onChange }: {
    orderId: number;
    payments: CustomerPaymentWithPayment[];
    defaultValue?: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    const elemRef = useRef<HTMLDivElement | null>(null)
    const [ current, setCurrent ] = useState(0)

    const handleScroll = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement
        setScale(target)
    }

    useEffect(() => {
        if (elemRef.current) {
            // setScale(elemRef.current)
            scrollIntoView(elemRef.current)
        }
    }, [])

    function setScale(elem: HTMLDivElement) {
        Array.from(elem.children).forEach((child, index) => {
            if (index) {
                const clientRect = child.getBoundingClientRect()
                const calcEmulation = (window.innerWidth - clientRect.width) / 2
                const posValue = Math.abs(clientRect.left - calcEmulation)
                const value = mapRange(posValue, 0, 400, 1, .7)
                if (value > 0.9) setCurrent(index)
                child.setAttribute('style', `--data-scale: ${value}`)
            }
        })
    }

    function scrollIntoView(elem: HTMLDivElement) {
        const checkedInput = elem.querySelector('input:checked')
        if (checkedInput) {
            const card = checkedInput.closest(`.${styles.card}`)
            console.log(card)
            card?.scrollIntoView({
                behavior: 'auto',
                block: 'nearest',
                inline: 'center'
            })
        }
    }

    const list = [
        ...payments.map(item => item.id),
    ]

    return (
        <div className={styles.payments}>
            <div ref={elemRef} className={styles.paymentContainer} onScroll={handleScroll}>
                <div className={clsx(styles.paymentCard, styles.addCard)}>
                    <div className={styles.blankCard}>
                        <Link className={styles.addPaymentCard} href={`/cart/${orderId}/payment/new`}>
                            <PlusCircleIcon />
                            Add Card
                        </Link>
                    </div>
                </div>
                {
                    payments.map(payment => (
                        payment.payment.isCredit ? (
                            <div className={styles.paymentCard} key={payment.id}>
                                <CreditCard payment={payment}>
                                    <Link className={styles.cardEdit} href={`/cart/${orderId}/payment/${payment.id}`}>
                                        <PencilSquareIcon />
                                    </Link>
                                    <label className={styles.checkBox}>
                                        <input type="radio" name="payemnt" defaultValue={payment.id} defaultChecked={payment.id == defaultValue} onChange={onChange} />
                                        <div className={styles.checkBoxIcon}>
                                            <CheckIcon />
                                        </div>
                                    </label>
                                </CreditCard>
                            </div>
                        ) : (
                            <div className={styles.paymentCard} key={payment.id}>
                                <CodCard>
                                    <label className={styles.checkBox}>
                                        <input type="radio" name="payemnt" defaultValue={payment.id} defaultChecked={payment.id == defaultValue} onChange={onChange} />
                                        <div className={styles.checkBoxIcon}>
                                            <CheckIcon />
                                        </div>
                                    </label>
                                </CodCard>
                            </div>
                        )
                    ))
                }
            </div>
            <ul className={styles.bulletContainer}>
                {
                    list.map((_, index) => (
                        <li
                            key={index}
                            className={clsx(styles.bullet, (index + 1) === current && styles.activeBullet)}
                        />
                    ))
                }
            </ul>
        </div>
    )
}

export function CreditCard({ payment, children, mini }: { payment: CustomerPaymentWithPayment, children?: React.ReactNode; mini?:boolean; }) {
    return (
        <div className={clsx(styles.card, styles.creditCard, mini && styles.miniCard)}>
            <div className={styles.cardActions}>
                { children }
            </div>
            <div className={styles.logo}>
                { payment.payment.name }
            </div>
            <div className={styles.cardNumber}>
                <small>Card Number</small>
                <div>{ payment.card.cardNumber }</div>
            </div>
            <div className={styles.name}>
                <small>Name</small>
                <div>{ payment.card.holderName }</div>
            </div>
            <div className={styles.expireDate}>
                <small>Expiration</small>
                <div>{ payment.card.expMonth } / { payment.card.expYear }</div>
            </div>
            <div className={styles.cvc}>
                <small>CVC</small>
                <div>{ payment.card.cvc }</div>
            </div>
        </div>
    )
}

export function CodCard({ children, mini }: { children?: React.ReactNode; mini?:boolean; }) {
    return (
        <div className={clsx(styles.card, mini && styles.miniCard)}>
            <div className={styles.cardActions}>
                { children }
            </div>
            <div className={styles.cash}>
                Cash on delivery
            </div>
        </div>
    )
}