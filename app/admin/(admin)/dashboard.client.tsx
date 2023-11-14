'use client'

import { ChildrenProp, ProductType } from "@/libs/definations"
import styles from './dashboard.module.css'
import { Budge, TextSkeleton } from "@/components/admin/utils/utils.client";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow, TableSkeleton } from "@/components/admin/table/table.client";
import { ThumbnailImages } from "@/components/admin/image/image.client";
import { formatPrice } from "@/libs/utils";
import { ClockIcon } from "@heroicons/react/24/outline";
import RelativeTime from 'react-relative-time'

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
                        {/* <col width="10%" /> */}
                        <col width="15%" />
                        <col width="20%" />
                        <col width="5%" />
                        <col width="20%" />
                        <col width="15%" />
                    </colgroup>
                    <TableHeader>
                        {/* <TableHead>#</TableHead> */}
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Last Update</TableHead>
                    </TableHeader>
                    <TableBody>
                        {
                            products.map((product) => (
                                <TableRow key={product.id}> 
                                    {/* <TableData>{ product.id }</TableData>   */}
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
                                    <TableData>
                                        <RelativeTime className={styles.lastUpdate} value={product.updateDate || product.createDate} />
                                    </TableData>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <footer className={styles.tableFooter}>
                <ClockIcon />
                Last update <RelativeTime value={lastDate} />
            </footer>
        </div>
    )
}

export function ProductTableSkileton() {
    return (
        <div className={styles.tableCard}>
            <div className={styles.tableContainer}>
                <TableSkeleton rows={5} cols={5} />
            </div>
            <footer className={styles.tableFooter}>
                <div className={styles.iconSkileton} />
                <TextSkeleton fontSizeEm={.7} />
            </footer>
        </div>
    )
}