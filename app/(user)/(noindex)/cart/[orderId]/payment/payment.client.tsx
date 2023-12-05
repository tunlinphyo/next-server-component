"use client"

import styles from './payment.module.css'
import { CustomerPaymentWithPayment, OrderWithPaymentAndAddress } from '../checkout.interface'
import clsx from 'clsx'
import { mapRange } from '@/libs/utils'
import Link from 'next/link'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { CheckIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'

export function PaymentForm({ order, payments, customerId }: { order: OrderWithPaymentAndAddress; payments: CustomerPaymentWithPayment[]; customerId: number }) {
    const [ payemnt, setPayment ] = useState(getPayment(order.customerPayment?.paymentId))
    const handleChange = (value: string) => {
        setPayment(getPayment(value))
    }

    function getPayment(id: string | number) {
        if (id === 'cash') {
            return {
                id: 'cash'
            } 
        }
        return payments.find(item => item.id === Number(id))
    }
    return (
        <form>
            <PaymentSlide orderId={order.id} payments={payments} onChange={e => handleChange(e.target.value)} />
            { payemnt?.id }
        </form>
    )
}

export function PaymentSlide({ orderId, payments, onChange }: { orderId: number; payments: CustomerPaymentWithPayment[]; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
    const elemRef = useRef<HTMLDivElement | null>(null)

    const handleScroll = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement
        const scrollX = target.scrollLeft
        setScale(target, scrollX)
    }

    useEffect(() => {
        if (elemRef.current) setScale(elemRef.current, 0)
    }, [])

    function setScale(elem: HTMLDivElement, scrollX: number = 0) {
        Array.from(elem.children).forEach((child, index) => {
            if (index) {
                const clientRect = child.getBoundingClientRect()
                const calcEmulation = (window.innerWidth - clientRect.width) / 2
                const posValue = Math.abs(clientRect.left - calcEmulation)
                const value = mapRange(posValue, 0, 400, 1, .7)
                child.setAttribute('style', `--data-scale: ${value}`)
            }
        })
    }

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
                        <div className={styles.paymentCard} key={payment.id}>
                            <div className={clsx(styles.card, styles.creditCard)}>
                                <div className={styles.cardActions}>
                                    <Link className={styles.cardEdit} href={`/cart/${orderId}/payment/${payment.id}`}>
                                        <PencilSquareIcon />
                                    </Link>
                                    <label className={styles.checkBox}>
                                        <input type="radio" name="payemnt" defaultValue={payment.id} onChange={onChange} />
                                        <div className={styles.checkBoxIcon}>
                                            <CheckIcon />
                                        </div>
                                    </label>
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
                        </div>
                    ))
                }
                <div className={styles.paymentCard}>
                    <div className={styles.card}>
                        <div className={styles.cardActions}>
                            <label className={styles.checkBox}>
                                <input type="radio" name="payemnt" defaultValue={'cash'} onChange={onChange} />
                                <div className={styles.checkBoxIcon}>
                                    <CheckIcon />
                                </div>
                            </label>
                        </div>
                        <div className={styles.cash}>
                            Cash on delivery
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
