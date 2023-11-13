'use client'

import { LinkIcon } from "@/components/admin/button/button.client";
import { FromDeleteButton } from "@/components/admin/form/form.client";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/admin/table/table.client";
import { ProductType } from "@/libs/definations";
import { formatDate, formatPrice } from "@/libs/utils";
import { PencilIcon } from "@heroicons/react/24/outline";
import { deleteProduct } from "./products.actions";
import { Budge } from "@/components/admin/utils/utils.client";


export function ProductTable({ products }: { products: ProductType[] }) {
    return (
        <Table>
            <TableHeader>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Create Date</TableHead>
                <TableHead></TableHead>
            </TableHeader>
            <TableBody>
                {
                    products.map(product => (
                        <TableRow key={product.id}>
                            <TableData>{ product.id }</TableData>
                            <TableData>{ product.name }</TableData>
                            <TableData>{ formatPrice(product.price) }</TableData>
                            <TableData>
                                <Budge>{ product.quantity }</Budge>
                            </TableData>
                            <TableData>{ formatDate(product.createDate) }</TableData>
                            <TableData end={true}>
                                <LinkIcon href={`/admin/product/products/${product.id}/edit`}>
                                    <PencilIcon />
                                </LinkIcon>
                                <FromDeleteButton action={deleteProduct.bind(null, product.id)} />
                            </TableData>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}