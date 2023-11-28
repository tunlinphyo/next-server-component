"use client"

import { CustomerType } from '@/libs/prisma/definations';
import styles from './shipping.module.css'
import { Order } from "@prisma/client"
import { Form, FormCreatButton, Input, PhoneInput, Textarea } from '@/components/user/form/form.client'
import { useFormState } from 'react-dom'
import { onShipping } from '../checkout.actions'
import { FooterBar } from '../checkout.client'
import { CreditCardIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef } from 'react';
import { useToast } from '@/components/user/toast/toast.index';

export function ShippingForm({ order, customer }: { order: Order; customer: CustomerType }) {
    const [ state, onAction ] = useFormState(onShipping, { message: '' })
    const { showToast } = useToast()

    useEffect(() => {
        if (state.message) showToast(state.message)
    }, [ state ])

    return (
        <form action={onAction} className={styles.form}>
            <div className={styles.formContainer}>
                <div className={styles.shippingForm}>
                    <Input
                        name="name"
                        defaultValue={order.name || customer.name}
                        error={state?.name}
                    >Name</Input>
                    <Input
                        type="email"
                        name="email"
                        defaultValue={order.email || customer.email}
                        error={state?.email}
                    >Email</Input>
                    <Input
                        type="tel"
                        name="phone"
                        defaultValue={order.phone || ''}
                        error={state?.phone}
                    >Phone</Input>
                </div>
                <div className={styles.shippingForm}>
                    SELECT FORM
                </div>
                <div className={styles.shippingForm}>
                    <Textarea
                        name="message"
                        defaultValue={order.note || ''}
                        error={state?.note}
                    >Message (optional)</Textarea>
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
