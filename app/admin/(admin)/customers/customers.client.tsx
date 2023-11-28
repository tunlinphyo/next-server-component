'use client'

import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/admin/table/table.client"
import { deleteCustomer } from "./customers.actions"
import { LinkIcon } from "@/components/admin/button/button.client"
import { PencilIcon } from "@heroicons/react/24/outline"
import { FromDeleteButton, IdContainer } from "@/components/admin/form/form.client"
import { formatDate } from '../../../../libs/utils';
import { ThumbnailImage } from "@/components/admin/image/image.client"
import styles from './customers.module.css'
import { Customer } from "@prisma/client"
import { Budge, DateTime } from "@/components/admin/utils/utils.client"
import { CustomerWithStatus } from "./customers.interface"

export function CustomerTable({ customers }: { customers: CustomerWithStatus[] }) {
    const getTheme = (id: number) => {
        if (id == 5) return 'success'
        if (id == 6) return 'danger'
        return 'default'
    }
    return (
        <Table>
            <colgroup>
                <col width="10%" />
                <col width="20%" />
                <col width="20%" />
                <col width="5%" />
                <col width="20%" />
                <col width="10%" />
            </colgroup>
            <TableHeader>
                <TableHead>#</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Create Date</TableHead>
                <TableHead></TableHead>
            </TableHeader>
            <TableBody>
                {
                    customers.map(customer => (
                        <TableRow key={customer.id}>
                            <TableData>
                                <IdContainer id={customer.id} />
                            </TableData>
                            <TableData>
                                <CustomerData customer={customer} />
                            </TableData>
                            <TableData>{ customer.email }</TableData>
                            <TableData>
                                <Budge theme={getTheme(customer.status.id)}>{ customer.status.name }</Budge>
                            </TableData>
                            <TableData>
                                <DateTime date={customer.createDate} />
                            </TableData>
                            <TableData end={true}>
                                <LinkIcon href={`/admin/customers/${customer.id}/edit`} theme="primary">
                                    <PencilIcon />
                                </LinkIcon>
                                <FromDeleteButton action={deleteCustomer.bind(null, customer.id)} />
                            </TableData>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}

export function CustomerData({ customer }: { customer: Customer }) {
    return (
        <div className={styles.customerData}>
            <ThumbnailImage image={customer.avatar || ''} />
            <h4 className={styles.customerName}>{ customer.name }</h4>
        </div>
    )
}