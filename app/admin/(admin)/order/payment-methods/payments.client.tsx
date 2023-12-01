'use client'

import { ThumbnailImage } from '@/components/admin/image/image.client'
import styles from './payments.module.css'
import { LinkIcon } from "@/components/admin/button/button.client"
import { Table, TableHeader, TableHead, TableBody, TableRow } from "@/components/admin/table/table.client"
import { TableData } from "@/components/user/table/table.client"
import { PencilIcon } from "@heroicons/react/24/outline"
import { Payment } from "@prisma/client"
import { Budge } from '@/components/admin/utils/utils.client'
import { SortableItem, SortableTable } from '@/components/admin/sortable-table/sortable-table.client'

export function PayemntTable({ payments }: { payments: Payment[] }) {
    const getTheme = (status: boolean) => {
        if (status) return 'danger'
        return 'success'
    }
    return (
        <SortableTable>
            {
                payments.map(payment => (
                    <SortableItem>
                        { payment.id } | { payment.name }
                    </SortableItem>
                ))
            }
        </SortableTable>
        // <Table>
        //     <TableHeader>
        //         <TableHead>#</TableHead>
        //         <TableHead>Payemnt</TableHead>
        //         <TableHead>Image</TableHead>
        //         <TableHead>Status</TableHead>
        //         <TableHead>Order</TableHead>
        //         <TableHead></TableHead>
        //     </TableHeader>
        //     <TableBody>
        //         {
        //             payments.map((payment) => (
        //                 <TableRow key={payment.id}>
        //                     <TableData>{ payment.id }</TableData>
        //                     <TableData>
        //                         <PaymentData payment={payment} />
        //                     </TableData>
        //                     <TableData>
        //                         <ThumbnailImage image={payment.image || ''} />
        //                     </TableData>
        //                     <TableData>
        //                         <Budge theme={getTheme(payment.isDisabled)}>{ payment.isDisabled ? 'Disabled' : 'Enabled' }</Budge>
        //                     </TableData>
        //                     <TableData>{ payment.order }</TableData>
        //                     <TableData end={true}>
        //                         <LinkIcon href={`/admin/order/payment-methods/${payment.id}/edit`} theme="primary">
        //                             <PencilIcon />
        //                         </LinkIcon>
        //                     </TableData>
        //                 </TableRow>
        //             ))
        //         }
        //     </TableBody>
        // </Table>
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