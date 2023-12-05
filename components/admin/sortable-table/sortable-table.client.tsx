'use client'

import { ChildrenProp } from '@/libs/definations'
import styles from './sortable-table.module.css'
import { Bars2Icon } from '@heroicons/react/24/outline'

export function SortableContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.sortableList}>
            { children }
        </div>
    )
}

export function SortableItem({ children }: ChildrenProp) {
    return (
        <li className={styles.listItem}>
            <div className={styles.listItemMenu}>
                <Bars2Icon />
            </div>
            { children }
        </li>
    )
}

export function SortableFooter({ children }: ChildrenProp) {
    return (
        <footer className={styles.footer}>
            { children }
        </footer>
    )
}