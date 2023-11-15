'use client'

import { ChildrenProp, ProductType } from "@/libs/definations"
import styles from './dashboard.module.css'
import { Budge, TextSkeleton } from "@/components/admin/utils/utils.client";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow, TableSkeleton } from "@/components/admin/table/table.client";
import { ThumbnailImages } from "@/components/admin/image/image.client";
import { ArrowTopRightOnSquareIcon, ClockIcon } from "@heroicons/react/24/outline";
import { ProductData } from "../product/products/products.client";
import { LinkIcon } from "@/components/admin/button/button.client";
import { timeAgo } from "@/libs/relative-time";

type SummaryCardProps = ChildrenProp & {
    icon: any;
    title: string;
}

export function DashboardSummary({ children }: ChildrenProp) {
    return (
        <section className={styles.summaryContaineer}>
            { children }
        </section>
    )
}

export function DashboardSummaryCard({ children, icon, title }: SummaryCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                { icon } { title }
            </div>
            <div className={styles.cardBody}>
                { children }
            </div>
        </div>
    )
}

export function DashboardSummarySkileton() {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.iconSkileton} />
                <TextSkeleton fontSizeEm={.7} />
            </div>
            <div className={styles.cardBody}>
                <TextSkeleton fontSizeEm={.9} />
            </div>
        </div>
    )
}

export function ProductTable({ lastDate, products }: { lastDate: Date, products: ProductType[] }) {
    return (
        <div className={styles.tableCard}>
            <div className={styles.tableContainer}>
                <Table>
                    <colgroup>
                        <col width="15%" />
                        <col width="40%" />
                        <col width="10%" />
                        <col width="15%" />
                        <col width="5%" />
                    </colgroup>
                    <TableHeader>
                        <TableHead>Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead></TableHead>
                    </TableHeader>
                    <TableBody>
                        {
                            products.map((product) => (
                                <TableRow key={product.id}> 
                                    <TableData>
                                        <ThumbnailImages images={product.images} />
                                    </TableData>
                                    <TableData>
                                        <ProductData product={product} />
                                    </TableData>
                                    <TableData>
                                        <Budge>{ product.quantity }</Budge>
                                    </TableData>
                                    <TableData>
                                        <div className={styles.lastUpdate}>
                                            { timeAgo(product.updateDate || product.createDate) }
                                        </div>
                                    </TableData>
                                    <TableData>
                                        <LinkIcon href={`/admin/product/products/${product.id}/edit`}>
                                            <ArrowTopRightOnSquareIcon />
                                        </LinkIcon>
                                    </TableData>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <footer className={styles.tableFooter}>
                <ClockIcon />
                Last update { timeAgo(lastDate) }
            </footer>
        </div>
    )
}

export function ProductTableSkileton() {
    return (
        <div className={styles.tableCard}>
            <div className={styles.tableContainer}>
                <TableSkeleton rows={5} cols={4} />
            </div>
            <footer className={styles.tableFooter}>
                <div className={styles.iconSkileton} />
                <TextSkeleton fontSizeEm={.7} />
            </footer>
        </div>
    )
}