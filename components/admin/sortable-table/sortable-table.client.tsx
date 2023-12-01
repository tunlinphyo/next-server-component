'use client'

import { ChildrenProp } from '@/libs/definations'
import styles from './sortable-table.module.css'
import { useEffect, useRef } from 'react'
import Sortable from 'sortablejs'

export function SortableTable({ children }: ChildrenProp) {
    const ulRef = useRef<HTMLUListElement | null>(null)

    useEffect(() => {
        if (ulRef.current) {
            const sortable = Sortable.create(ulRef.current, {
                onChange: function(evt) {
                    console.log('ON_CHANGE___', evt.newIndex)
                }
            })
        }
    }, [])

    return (
        <div className={styles.sortableList}>
            <ul ref={ulRef} className={styles.listContainer}>
                { children }
            </ul>
        </div>
    )
}

export function SortableItem({ children }: ChildrenProp) {
    return (
        <li>{ children }</li>
    )
}