'use client'

import styles from './customer-payment.module.css'
import { FormCreatButton, Input, Select } from '@/components/user/form/form.client'
import { FooterBar } from '../../checkout.client'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { useFormState } from 'react-dom'
import { usePayment } from '../paymnet.utils'
import { FormArrayType } from '@/libs/definations'
import { useEffect, useState } from 'react'
import { onCustomerPayment } from './customer-payemnt.actions'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/user/toast/toast.index'
import { CustomerPaymentWithPayment } from '../../checkout.interface'

type PaymentFormProps = {
    customerPayment?: CustomerPaymentWithPayment | null;
    customerId: number;
    orderId: string;
    payments: FormArrayType[];
}

export function PaymentForm({ customerPayment, customerId, orderId, payments }: PaymentFormProps) {
    const [ state, onAction ] = useFormState(onCustomerPayment, { message: '' })
    const { years, monthes } = usePayment()
    const router = useRouter()
    const { showToast } = useToast()

    useEffect(() => {
        if (state.message) showToast(state.message)
        if (state.back) router.back()
    }, [ state ])

    return (
        <form action={onAction} className={styles.form}>
            <div className={styles.formContainer}>
                <div className={styles.paymentForm}>
                    <input type="hidden" name="customerId" defaultValue={customerId} />
                    <input type="hidden" name="orderId" defaultValue={orderId} />
                    <input type="hidden" name="customerPayemntId" defaultValue={customerPayment?.id} />
                    <Select
                        name="paymentId"
                        placeholder="Card type"
                        list={payments}
                        error={state?.paymentId}
                        defaultValue={String(customerPayment?.paymentId)}
                    >Payment</Select>
                    <Input
                        name="holderName"
                        defaultValue={customerPayment?.card.holderName || ''}
                        error={state?.holderName}
                    >Holder Name</Input>
                    <Input
                        name="cardNumber"
                        defaultValue={customerPayment?.card.cardNumber || ''}
                        error={state?.cardNumber}
                    >Card Number</Input>
                    <div className={styles.gridContainer}>
                        <div className={styles.expSelect}>
                            <Select
                                name="expYear"
                                list={years}
                                placeholder='YYYY'
                                error={state?.expYear}
                                defaultValue={customerPayment?.card.expYear || ''}
                            >YYYY</Select>
                            <Select
                                name="expMonth"
                                list={monthes}
                                placeholder='MM'
                                error={state?.expMonth}
                                defaultValue={customerPayment?.card.expMonth || ''}
                            >MM</Select>
                        </div>
                        <Input
                            name="cvc"
                            defaultValue={customerPayment?.card.cvc || ''}
                            error={state?.cvc}
                        >CVC</Input>
                    </div>
                </div>
            </div>
            <FooterBar>
                <FormCreatButton icon={<CheckCircleIcon />}>
                    { customerPayment ? 'Edit' : 'Save' }
                </FormCreatButton>
            </FooterBar>
        </form>
    )
}

