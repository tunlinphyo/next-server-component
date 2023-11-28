'use client'

import { useFormState } from 'react-dom'
import { CustomerEdit } from '../../account.interface'
import styles from './edit.module.css'
import { onCustomerEdit } from './edit.actions'
import { DisplayInput, Form, FormCreatButton, FormFooter, FormSkeleton, Input } from '@/components/user/form/form.client'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { AddressInput } from '@/components/user/form/address/address.client'
import { useEffect } from 'react'
import { useToast } from '@/components/user/toast/toast.index'
import clsx from 'clsx'

export function EditForm({ customer }: { customer: CustomerEdit }) {
    const [ state, onAction ] = useFormState(onCustomerEdit, { message: '' })
    const { showToast } = useToast()
    const customerAddress = customer.address[0]
    useEffect(() => {
        if (state.message) showToast(state.message)
    }, [ state ])

    return (
        <div className={styles.formContainer}>
            <Form action={onAction} footer={
                <FormFooter>
                    <FormCreatButton icon={<CheckCircleIcon />}>
                        Update
                    </FormCreatButton>
                </FormFooter>
            }>
                <input type="hidden" name="customerId" defaultValue={customer.id} />
                <DisplayInput
                    defaultValue={customer.email}
                >Email</DisplayInput>
                <Input 
                    name="name"
                    defaultValue={customer.name}
                    error={state.name}
                >Name</Input>
                <AddressInput 
                    address={customerAddress?.address}
                    country={customerAddress?.country}
                    state={customerAddress?.state}
                    city={customerAddress?.city}
                    error={state}
                />
            </Form>
        </div>
    )
}

export function EditSkeleton() {
    return (
        <div className={clsx(styles.formContainer, "skeleton")}>
            <FormSkeleton count={6} />
        </div>
    )
}