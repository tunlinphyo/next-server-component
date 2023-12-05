'use client'

import { ThumbnailImage } from '@/components/admin/image/image.client'
import styles from './payments.module.css'
import { LinkIcon } from "@/components/admin/button/button.client"
import { BanknotesIcon, CheckCircleIcon, CreditCardIcon, PencilIcon } from "@heroicons/react/24/outline"
import { Payment } from "@prisma/client"
import { Budge } from '@/components/admin/utils/utils.client'
import { SortableContainer, SortableFooter, SortableItem } from '@/components/admin/sortable-table/sortable-table.client'
import { ReactSortable } from 'react-sortablejs'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import { onSorting } from './payments.actions'
import { FormCreatButton } from '@/components/user/form/form.client'
import clsx from 'clsx'

export function PayemntTable({ payments }: { payments: Payment[] }) {
    const [ list, setList ] = useState<Payment[]>(payments)
    const [ state, onAction ] = useFormState(onSorting, { message: '' })
    return (
        <SortableContainer>
            <form action={onAction}>
                <ReactSortable list={list} setList={setList}>
                    {
                        list.map((payment, index) => (
                            <SortableItem>
                                <ItemData payment={payment} index={index} />
                            </SortableItem>
                        ))
                    }
                </ReactSortable>
                <SortableFooter>
                    <FormCreatButton icon={<CheckCircleIcon />}>Update order</FormCreatButton>
                </SortableFooter>
            </form>
        </SortableContainer>
    )
}

export function ItemData({ payment, index }: { payment: Payment; index: number }) {
    const getTheme = (status: boolean) => {
        if (status) return 'danger'
        return 'success'
    }
    return (
        <div className={styles.gridTable}>
            <div>
                { payment.id }
                <input type="hidden" name="id" defaultValue={payment.id} />
                <input type="hidden" name="order" value={index} />
            </div>
            <PaymentData payment={payment} />
            <div>
                <ThumbnailImage image={payment.image || ''} />
            </div>
            <div className={clsx(styles.center, styles.icon)}>
                {
                    payment.isCredit ? <CreditCardIcon /> : <BanknotesIcon />
                }
            </div>
            <div className={styles.center}>
                <Budge theme={getTheme(payment.isDisabled)}>{ payment.isDisabled ? 'Disabled' : 'Enabled' }</Budge>
            </div>
            <div className={styles.end}>
                <LinkIcon href={`/admin/order/payment-methods/${payment.id}/edit`} theme="primary">
                    <PencilIcon />
                </LinkIcon>
            </div>
        </div>
    )
}

export function PaymentData({ payment }: { payment: Payment }) {
    return (
        <div className={styles.paymentData}>
            <ThumbnailImage image={payment.logo || ''} />
            <h4 className={styles.paymentName}>{ payment.name }</h4>
        </div>
    )
}