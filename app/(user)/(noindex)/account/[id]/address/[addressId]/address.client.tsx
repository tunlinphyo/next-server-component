'use client'

import { Form, FormCreatButton, FormFooter, FormSkeleton } from '@/components/user/form/form.client';
import styles from '../../edit/edit.module.css'
import { CustomerAddress } from "@prisma/client";
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { AddressInput } from '@/components/user/form/address/address.client';
import { useFormState } from 'react-dom';
import { onAddressEdit } from './address.actions';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AddressEditForm({ customerId, address }: { customerId: number; address: CustomerAddress | null }) {
    const [ state, onAction ] = useFormState(onAddressEdit, { message: '' })
    const router = useRouter()

    useEffect(() => {
        if (state.back) router.back()
    }, [ state ])

    return (
        <div className={styles.formContainer}>
            <Form action={onAction} footer={
                <FormFooter>
                    <FormCreatButton icon={<CheckCircleIcon />}>
                        { address?.id ? 'Edit' : 'Create' }
                    </FormCreatButton>
                </FormFooter>
            }>
                <input type="hidden" name="customerId" defaultValue={customerId} />
                <input type="hidden" name="id" defaultValue={address?.id} />
                <AddressInput
                    address={address?.address}
                    country={address?.country}
                    state={address?.state}
                    city={address?.city}
                    error={state}
                />
            </Form>
        </div>
    )
}

export function AddressFormSkeleton() {
    return (
        <div className={styles.formContainer}>
            <FormSkeleton count={4} />
        </div>
    )
}