'use client'

import styles from './table.module.css'
import { ChildrenProp } from '../../../libs/definations';
import { TextSkeleton } from '../utils/utils.client';
import clsx from 'clsx';

type TableHeadProps = {
    children?: React.ReactNode
}
type TableDataProps = ChildrenProp & {
    end?: boolean
}

export function Table({ children }: ChildrenProp) {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                { children }
            </table>
        </div>
    )
}

export function TableHeader({ children }: ChildrenProp) {
    return (
        <thead>
            <tr>
                { children }
            </tr>
        </thead>
    )
}

export function TableBody({ children }: ChildrenProp) {
    return (
        <tbody>
            { children }
        </tbody>
    )
}

export function TableRow({ children }: ChildrenProp) {
    return (
        <tr>{ children }</tr>
    )
}

export function TableHead({ children }: TableHeadProps) {
    return (
        <th>
            <div className={styles.th}>{ children ?? '' }</div>
        </th>
    )
}

export function TableData({ children, end }: TableDataProps) {
    return (
        <td>
            <div className={clsx(styles.td, end && styles.flexEnd)}>{ children }</div>
        </td>
    )
}

export function TableSkeleton({ cols, rows }: { cols: number, rows: number }) {
    const columns = new Array(cols).fill('#')
    const rowlist = new Array(rows).fill('#')
    return (
        <Table>
            <TableHeader>
                {
                    columns.map((_, cIndex) => (
                        <TableHead key={cIndex}>
                            <TextSkeleton fontSizeEm={.9} />
                        </TableHead>
                    ))
                }
            </TableHeader>
            <TableBody>
                {
                    rowlist.map((_, rIndex) => (
                        <TableRow key={rIndex}>
                            {
                                columns.map((_, cIndex) => (
                                    <TableData key={cIndex}>{' '}</TableData>
                                ))
                            }
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}
