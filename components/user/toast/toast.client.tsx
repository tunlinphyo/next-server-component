'use client'

import styles from "./toast.module.css"
import clsx from "clsx"
import { useEffect, useRef } from "react"
import { useInitToast } from "./toast.index"

export function ToastGroup() {
    const toastRef = useRef<HTMLElement | null>(null)
    const { setToastGroup } = useInitToast()

    useEffect(() => {
        if (toastRef.current) setToastGroup(toastRef.current)
    }, [ toastRef ])

    return (
        <section className={clsx(styles.toastGroup, "user-app-toast-group")} ref={toastRef} />
    )
}