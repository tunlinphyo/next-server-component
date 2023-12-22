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
import { SlideItem, SlideSkeleton } from '@/components/user/slide/slide.client'
import { ProductSkeleton } from '../../products/products.client'
import { OrderWithPayemntAndStatus } from './account.interface'
import { ProductWithPriceAndStock } from '../../products/product.interface'
import { maskNumber, withPadStart } from '@/libs/utils'
import { OrderStatusIcon, ProgressRing } from './[id]/orders/orders.client'
import { getStatusName, getStatusStep } from './[id]/orders/orders.utils'
import { timeAgo } from '@/libs/relative-time'
import { Budge } from '@/components/user/utils/utils.client'
import { ORDER_STATUS_PENDING } from '@/libs/const'

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

export function OrderItem({ order }: { order: OrderWithPayemntAndStatus }) {
    const statusId = order.orderStatusId
    const name = getStatusName(statusId)
    const step = getStatusStep(statusId)
    return (
        <div className={clsx(styles.orderItem, 'observer-scale')}
            style={{ color: `var(--order-status-${name})` }}
        >
            <div className={styles.orderMedia}>
                <div className={styles.orderStatus}>
                    <ProgressRing statusId={statusId} step={step}  />
                </div>
                <div className={styles.statusIcon}>
                    <OrderStatusIcon statusId={statusId} />
                </div>
                <div className={styles.orderStatusName}>
                    <div className={styles.status}>
                        { order.orderStatus.name }
                    </div>
                </div>
            </div>
            <div className={styles.orderDetail}>
                <div className={styles.timeAgo}>
                    { timeAgo(order.updateDate || order.createDate) }
                </div>
                <div className={styles.orderId}>#{
                    order.orderStatusId == ORDER_STATUS_PENDING
                        ? maskNumber(withPadStart(order.id), 6)
                        : withPadStart(order.id)
                }</div>
            </div>
            <OrderLink orderId={order.id} statusId={order.orderStatusId} userId={order.customerId} />
        </div>
    )
}

export function OrderLink({ orderId, userId, statusId }: { orderId: number; userId: number; statusId: number }) {
    const href = statusId == ORDER_STATUS_PENDING ? `/cart/${orderId}/shipping` : `/account/${userId}/orders/${orderId}`
    return (
        <Link href={href} className={styles.orderLink}>
            { statusId == ORDER_STATUS_PENDING ? 'continue' : 'View Detail' }
            <ArrowRightIcon />
        </Link>
    )
}

export function MoreButton({ id, name }: { id: number, name: string; }) {
    return (
        <div className={clsx(styles.slideItem, styles.slideItemEnd)}>
            <Link href={`/account/${id}/${name}`} className={styles.goButton}>
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

export function FavouriteSkeleton() {
    return (
        <SlideSkeleton>
            <SlideItem>
                <ProductSkeleton />
            </SlideItem>
            <SlideItem>
                <ProductSkeleton />
            </SlideItem>
        </SlideSkeleton>
    )
}

export function LogoutFormSkeleton() {
    return (
        <div className={styles.logoutFrom}>
            <div className="primary-button fill skeleton" />
        </div>
    )
}