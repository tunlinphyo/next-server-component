'use client'

import styles from './account.module.css'
import { useFormState, useFormStatus } from "react-dom"
import { onLogout } from "./account.actions"
import { useEffect } from "react"
import { appToast } from "@/libs/toasts"
import { ArrowPathIcon, ArrowRightIcon, ArrowRightOnRectangleIcon, EnvelopeIcon, MapPinIcon, PencilIcon, UserIcon } from "@heroicons/react/24/outline"
import { CustomerType } from '@/libs/prisma/definations'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function UserDetail({ user, children }: { user: CustomerType, children: React.ReactNode }) {
    return (
        <div className={styles.userDetail}>
            <div className={styles.detailCard}>
                <div className={styles.flexStart}>
                    <UserIcon />
                    <div className={styles.detail}>{ user.name }</div>
                </div>
                <div className={styles.flexStart}>
                    <EnvelopeIcon />
                    <div className={styles.detail}>{ user.email }</div>
                </div>
                <div className={styles.flexStart}>
                    <MapPinIcon />
                    <div className={styles.detail}>
                        { children }
                    </div>
                </div>
                <Link href={`/account/${user.id}/edit`} className={clsx(styles.editButton, "button")}>
                    Edit
                    <PencilIcon />
                </Link>
            </div>
        </div>
    )
}

export function LogoutForm() {
    const [ state, onAction ] = useFormState(onLogout, { code: '' })
    const { replace } = useRouter()

    useEffect(() => {
        if (state.code) {
            appToast(state.code)
            replace('/')
        }
    }, [ state ])

    return (
        <form action={onAction} className={styles.logoutFrom}>
            <LogoutButton />
        </form>
    )
}

export function MoreButton({ id }: { id: number }) {
    return (
        <div className={clsx(styles.slideItem, styles.slideItemEnd)}>
            <Link href={`/account/${id}/favourites`} className={styles.goButton}>
                <ArrowRightIcon />
            </Link>
        </div>
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

export function UserDetailSkeleton() {
    return (
        <div className={styles.userDetail}>
            <div className={styles.detailCard}>
                <div className={styles.flexStart}>
                    <UserIcon />
                </div>
                <div className={styles.flexStart}>
                    <EnvelopeIcon />
                </div>
                <div className={styles.flexStart}>
                    <MapPinIcon />
                </div>
                <div className={clsx(styles.editButton, "button skeleton")} />
            </div>
        </div>
    )
}

export function LogoutFormSkeleton() {
    return (
        <div className={styles.logoutFrom}>
            <div className="primary-button fill skeleton" />
        </div>
    )
}