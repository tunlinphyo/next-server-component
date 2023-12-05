"use client"

import styles from './payment.module.css'
import { CustomerPaymentWithPayment } from '../checkout.interface'
import clsx from 'clsx'
import { mapRange } from '@/libs/utils'
import Link from 'next/link'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { CheckIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline'

export function PaymentSlide({ orderId, customerId, payments }: { orderId: number; customerId: number, payments: CustomerPaymentWithPayment[] }) {

    const handleScroll = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement
        const scrollX = target.scrollLeft
        Array.from(target.children).forEach((child, index) => {
            if (index) {
                const clientRect = child.getBoundingClientRect()
                const calcEmulation = (window.innerWidth - clientRect.width) / 2
                const posValue = Math.abs(clientRect.left - calcEmulation)
                const value = mapRange(posValue, 0, 400, 1, .7)
                console.log(index, posValue, value, scrollX)
                child.setAttribute('style', `--data-scale: ${value}`)
            }
        })
    }

    return (
        <div className={styles.payments}>
            <div className={styles.paymentContainer} onScroll={handleScroll}>
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
                                        <input type="radio" name="payemnt" defaultValue={payment.id} />
                                        <div className={styles.checkBoxIcon}>
                                            <PlusIcon className={styles.plus} />
                                            <CheckIcon className={styles.check} />
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
                                <input type="radio" name="payemnt" defaultValue={'cash'} />
                                <div className={styles.checkBoxIcon}>
                                    <PlusIcon className={styles.plus} />
                                    <CheckIcon className={styles.check} />
                                </div>
                            </label>
                        </div>
                        Cash on delivery
                    </div>
                </div>
            </div>
        </div>
    )
}
