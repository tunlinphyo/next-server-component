'use client'

import { LinkIcon } from "@/components/admin/button/button.client";
import { FromDeleteButton } from "@/components/admin/form/form.client";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/admin/table/table.client";
import { ProductType } from "@/libs/definations";
import { formatDate, formatPrice } from "@/libs/utils";
import { PencilIcon } from "@heroicons/react/24/outline";
import { deleteProduct } from "./products.actions";
import { Budge } from "@/components/admin/utils/utils.client";
import { ThumbnailImages } from "@/components/admin/image/image.client";


export function ProductTable({ products }: { products: ProductType[] }) {
    return (
        <Table>
            <colgroup>
                <col width="5%" />
                <col width="15%" />
                <col width="20%" />
                <col width="6%" />
                <col width="20%" />
                <col width="10%" />
            </colgroup>
            <TableHeader>
                <TableHead>#</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead></TableHead>
            </TableHeader>
            <TableBody>
                {
                    products.map(product => (
                        <TableRow key={product.id}>
                            <TableData>{ product.id }</TableData>
                            <TableData>
                                <ThumbnailImages images={product.images} />
                            </TableData>
                            <TableData>{ product.name }</TableData>
                            <TableData>
                                <Budge>{ product.quantity }</Budge>
                            </TableData>
                            <TableData>
                                { formatPrice(product.minPrice) }
                                { product.minPrice != product.maxPrice && <div>~</div> }
                                { product.minPrice != product.maxPrice && formatPrice(product.maxPrice) }
                            </TableData>
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