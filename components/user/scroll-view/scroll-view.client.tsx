'use client'

import { usePageScrollPosition } from './scroll-view.utils'
import styles from './scroll-view.module.css'
import { ChildrenProp } from "@/libs/definations"
import { useRef } from 'react'

export function ScrollView({ children }: ChildrenProp) {
    const el = useRef<HTMLDivElement | null>(null)
    const handleScroll = usePageScrollPosition(el)
    return (
        <div ref={el} 
            onScroll={handleScroll}
            className={styles.scrollView}>
            { children }
        </div>
    )
}