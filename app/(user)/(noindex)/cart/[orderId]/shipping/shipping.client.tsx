"use client"

import { CustomerType } from '@/libs/prisma/definations';
import styles from './shipping.module.css'
import { CustomerAddress, Order } from "@prisma/client"
import { FormCreatButton, FormSkeleton, Input, AddressRadios, Textarea, PhoneInput } from '@/components/user/form/form.client'
import { useFormState } from 'react-dom'
import { onShipping } from '../checkout.actions'
import { FooterBar } from '../checkout.client'
import { CreditCardIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import React, { createContext, useContext, useEffect } from 'react';
import { useToast } from '@/components/user/toast/toast.index';
import { formatAddress } from '@/app/(user)/user/user.utils';
import Link from 'next/link';

const initState: Record<string, string> = {
    message: '',
}

const StateContext = createContext(initState)

export function ShippingForm({ order, customer, children }: { order: Order; customer: CustomerType, children: React.ReactNode }) {
    const [ state, onAction ] = useFormState(onShipping, initState)
    const { showToast } = useToast()

    useEffect(() => {
        if (state.message) showToast(state.message)
    }, [ state ])

    return (
        <form action={onAction} className={styles.form}>
            <div className={styles.formContainer}>
                <div className={styles.shippingForm}>
                    <input type="hidden" name="orderId" defaultValue={order.id} />
                    <input type="hidden" name="customerId" defaultValue={customer.id} />
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
                    <PhoneInput
                        name="phone"
                        defaultValue={order.phone || ''}
                        error={state?.phone}
                    >Tel Phone</PhoneInput>
                </div>
                <div className={styles.shippingForm}>
                    <StateContext.Provider value={state}>
                        { children }
                    </StateContext.Provider>
                </div>
                <div className={styles.shippingForm}>
                    <Textarea
                        name="note"
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

export function AddressInput({ customerId, addrList, addressId }: {
    customerId: number;
    addrList: CustomerAddress[];
    addressId?: number | null;
}) {
    const state = useContext(StateContext);
    const list = addrList.map(item => ({
        id: item.id,
        name: formatAddress(item)
    }))
    return (
        <>
            <AddressRadios
                customerId={customerId}
                name="addressId"
                list={list}
                defaultValue={addressId || ''}
                error={state?.addressId}
            >Address</AddressRadios>
            <Link href={`/account/${customerId}/address/new`} className="button fill">
                Add address
                <PlusCircleIcon />
            </Link>
        </>
    )
}

export function ShippingSkeleton() {
    return (
        <div className={styles.form}>
            <FormSkeleton count={3} />
        </div>
    )
}
