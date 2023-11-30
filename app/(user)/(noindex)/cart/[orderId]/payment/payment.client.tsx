"use client"

import styles from './payment.module.css'
import { OrderWithPaymentAndAddress } from '../checkout.interface'
import { FormCreatButton, FormSkeleton, Input, AddressRadios, Textarea, PhoneInput, Select } from '@/components/user/form/form.client'
import { FooterBar } from '../checkout.client'
import { CreditCardIcon } from '@heroicons/react/24/outline'
import { useFormState } from 'react-dom'
import { onPayment } from '../checkout.actions'
import { CustomerType } from '@/libs/prisma/definations'

export function PaymentForm({ order, customer }: { order: OrderWithPaymentAndAddress; customer: CustomerType }) {
    const [ state, onAction ] = useFormState(onPayment, { message: '' })

    return (
        <form action={onAction} className={styles.form}>
            <div className={styles.formContainer}>
                <div className={styles.paymentForm}>
                    <input type="hidden" name="orderId" defaultValue={order.id} />
                    <input type="hidden" name="customerId" defaultValue={customer.id} />
                    <Select
                        name="paymentId"
                        list={[]}
                    >Payment</Select>
                    <Input
                        name="holderName"
                        defaultValue={''}
                        error={state?.holderName}
                    >Holder Name</Input>
                    <Input
                        name="cardNumber"
                        defaultValue={''}
                        error={state?.cardNumber}
                    >Card Number</Input>
                    <div className={styles.gridContainer}>
                        <div className={styles.expSelect}>
                            <Select
                                name="paymentId"
                                list={[]}
                                placeholder='YYYY'
                            >YYYY</Select>
                            <Select
                                name="paymentId"
                                list={[]}
                                placeholder='MM'
                            >MM</Select>
                        </div>
                        <Input
                            name="cvc"
                            defaultValue={''}
                            error={state?.cvc}
                        >CVC</Input>
                    </div>
                </div>
            </div>
            <FooterBar>
                <FormCreatButton icon={<CreditCardIcon />}>
                    Payment
                </FormCreatButton>
            </FooterBar>
        </form>
    )
}
