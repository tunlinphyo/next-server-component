'use client'

import styles from './slide.module.css'
import { useEffect } from "react"
import { useXScroll } from "./slide.utils"
import { useIntersectionObserver } from "@/libs/intersection-observer"


export function Slide({ id, children, start, end }: {
    id: number | string;
    children?: React.ReactNode;
    start?: React.ReactNode;
    end?: React.ReactNode;
}) {
    const { elemRef, handleScroll } = useXScroll(id)

    useEffect(() => {
        const { observe, unobserve } = useIntersectionObserver(elemRef?.current, entry => {
            entry.target.classList.toggle("observer-inview", entry.isIntersecting)
        }, .25)
        observe()

        return () => {
            unobserve()
        }
    }, [])

    return (
        <div className={styles.slides}>
            <div ref={elemRef} className={styles.slideContainer} onScroll={handleScroll}>
                { start }
                { children }
                { end }
            </div>
        </div>
    )
}

export function SlideItem({ children }: { children: React.ReactNode }) {
    return <div className={styles.slideItem}>{ children }</div>
}

export function SlideSkeleton({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.slides}>
            <div className={styles.slideContainer}>
                { children }
            </div>
        </div>
    )
}
