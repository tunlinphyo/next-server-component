'use client'

import styles from './product.module.css'
import { ProductClassType, ProductType } from "@/libs/definations";
import { AddToCartForm, OutofStockButton } from "../products.client";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/libs/utils';
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from '@/components/user/table/table.client';
import React from 'react';
import { TextSkeleton } from '@/components/user/utils/utils.client';
import { Budge } from '@/components/user/utils/utils.client';
import { ProductClassWithVariants, type ProductDetail } from '../product.interface';

export function ProductDetail({ product, minPrice, maxPrice }: {
    product: ProductDetail;
    minPrice: number;
    maxPrice: number;
}) {
    const lines = product.description.split(/\r?\n/);
    return (
        <div className={styles.productDetail}>
            <ul className={styles.categories}>
                {
                    product.categories?.map(item => (
                        <li key={item.categoryId}>
                            <Budge>{ item.category.name }</Budge>
                        </li>
                    ))
                }
            </ul>
            <div className={styles.productPrice}>
                { formatPrice(minPrice) }
                { minPrice != maxPrice && <span>~</span> }
                { minPrice != maxPrice && formatPrice(maxPrice) }
            </div>
            <p className={styles.productDescription}>
                {
                    lines.map((line, index) => (
                        <React.Fragment key={index}>
                        {line}
                        <br />
                        </React.Fragment>
                    ))
                }
            </p>
        </div>
    )
}

export function ProductActions({ productClass, stock }: { productClass: ProductClassWithVariants[]; stock: number }) {
    const router = useRouter()

    return (
        <footer className={styles.productActions}>
            <button className={styles.backButton} onClick={() => router.back()}>
                <ArrowLeftIcon />
            </button>
            {
                !!stock 
                    ? <AddToCartForm productClass={productClass} />
                    : <OutofStockButton />
            }
        </footer>
    )
}

export function ProductTitle({ title }: { title: string }) {
    return (
        <h2 className={styles.productTitle}>{ title }</h2>
    )
}

export function TitleSkeleton() {
    return (
        <div className={styles.productTitle}>
            <TextSkeleton fontSizeEm={2} width={100} />
            <TextSkeleton fontSizeEm={2} width={150} top={10} />
        </div>
    )
}

export function ProductClassTable({ product }: { 
    product: ProductDetail;
}) {
    return (
        <div className={styles.classContainer}>
            <Table>
                <TableHeader>
                    <TableHead>{ product.variant1?.name }</TableHead>
                    <TableHead>{ product.variant2?.name }</TableHead>
                    <TableHead></TableHead>
                </TableHeader>
                <TableBody>
                    {
                        product.productClasses.map(item => (
                            <TableRow key={item.id}>
                                <TableData>{ item.variant1?.name }</TableData>
                                <TableData>{ item.variant2?.name }</TableData>
                                <TableData end>{ formatPrice(item.price) }</TableData>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}
