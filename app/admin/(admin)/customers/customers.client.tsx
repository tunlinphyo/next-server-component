'use client'

import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/admin/table/table.client"
import { deleteCustomer } from "./customers.actions"
import { LinkIcon } from "@/components/admin/button/button.client"
import { PencilIcon } from "@heroicons/react/24/outline"
import { FromDeleteButton, IdContainer } from "@/components/admin/form/form.client"
import { CustomerType } from "@/libs/definations"
import { formatDate } from '../../../../libs/utils';

export function CustomerTable({ customers }: { customers: CustomerType[] }) {
    return (
        <Table>
            <colgroup>
                <col width="10%" />
                <col width="15%" />
                <col width="15%" />
                <col width="20%" />
                <col width="5%" />
            </colgroup>
            <TableHeader>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
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
                            <TableData>{ customer.name }</TableData>
                            <TableData>{ customer.email }</TableData>
                            <TableData>{ formatDate(customer.createDate) }</TableData>
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