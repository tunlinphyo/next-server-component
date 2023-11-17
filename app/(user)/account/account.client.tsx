'use client'

import styles from './account.module.css'
import { useFormState, useFormStatus } from "react-dom"
import { onLogin } from "./account.actions"
import { useEffect } from "react"
import { appToast } from "@/libs/toasts"
import { ArrowPathIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"

export function LogoutForm() {
    const [ state, onAction ] = useFormState(onLogin, { code: '' })

    useEffect(() => {
        if (state.code) appToast(state.code)
    }, [ state ])

    return (
        <form action={onAction} className={styles.logoutFrom}>
            <LogoutButton />
        </form>
    )
}

export function LogoutButton() {
    const { pending } = useFormStatus()
    return (
        <button className="primary-button fill" disabled={pending}>
            Logout
            { pending ? <ArrowPathIcon className="icon-loading" /> : <ArrowRightOnRectangleIcon /> }
        </button>
    )
}

export function LogoutFormSkeleton() {
    return (
        <div className={styles.logoutFrom}>
            <div className="primary-button fill skeleton" />
        </div>
    )
}