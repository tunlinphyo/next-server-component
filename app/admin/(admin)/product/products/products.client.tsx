'use client'

import { LinkIcon } from "@/components/admin/button/button.client";
import { FromDeleteButton, IdContainer } from "@/components/admin/form/form.client";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/admin/table/table.client";
import { ProductType } from "@/libs/definations";
import { formatPrice } from "@/libs/utils";
import { PencilIcon } from "@heroicons/react/24/outline";
import { deleteProduct } from "./products.actions";
import { Budge } from "@/components/admin/utils/utils.client";
import { ThumbnailImages } from "@/components/admin/image/image.client";
import styles from './products.module.css'


export function ProductTable({ products }: { products: ProductType[] }) {
    return (
        <Table>
            <colgroup>
                <col width="5%" />
                <col width="15%" />
                <col width="40%" />
                <col width="10%" />
                <col width="10%" />
            </colgroup>
            <TableHeader>
                <TableHead>#</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead></TableHead>
            </TableHeader>
            <TableBody>
                {
                    products.map(product => (
                        <TableRow key={product.id}>
                            <TableData>
                                <IdContainer id={product.id} />
                            </TableData>
                            <TableData>
                                <ThumbnailImages images={product.images} />
                            </TableData>
                            <TableData>
                                <ProductData product={product} />
                            </TableData>
                            <TableData>
                                <Budge>{ product.quantity }</Budge>
                            </TableData>
                            <TableData end={true}>
                                <LinkIcon href={`/admin/product/products/${product.id}/edit`} theme="primary">
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

export function ProductData({ product }: { product: ProductType }) {
    return (
        <div className={styles.productData}>
            <h4 className={styles.productName}>{ product.name }</h4>
            <small className={styles.productPrice}>
                { formatPrice(product.minPrice) }
                { product.minPrice != product.maxPrice && <span>~</span> }
                { product.minPrice != product.maxPrice && formatPrice(product.maxPrice) }
            </small>
        </div>
    )
}