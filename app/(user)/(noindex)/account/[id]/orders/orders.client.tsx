'use client'

import styles from './orders.module.css'
import { ORDER_STATUS_CANCEL, ORDER_STATUS_DELIVERED, ORDER_STATUS_NEW, ORDER_STATUS_PAID, ORDER_STATUS_PENDING, ORDER_STATUS_RETURN } from "@/libs/const";
import { ArrowPathRoundedSquareIcon, ClockIcon, CreditCardIcon, NoSymbolIcon, TicketIcon, TruckIcon } from "@heroicons/react/24/outline";
import { getStatusName, useRing } from './orders.utils';
import { OrderWithPayemntAndStatus } from '../../account.interface';

export function OrderStatusIcon({ statusId }: { statusId: number }) {
    switch (statusId) {
        case ORDER_STATUS_PENDING: return <ClockIcon />
        case ORDER_STATUS_NEW: return <TicketIcon />
        case ORDER_STATUS_PAID: return <CreditCardIcon />
        case ORDER_STATUS_DELIVERED: return <TruckIcon />
        case ORDER_STATUS_RETURN: return <ArrowPathRoundedSquareIcon />
        case ORDER_STATUS_CANCEL: return <NoSymbolIcon />
        default: return <ClockIcon />
    }
}

export function ProgressRing({ statusId, step, ringSize, maxStep }: { statusId: number; step: number; ringSize?: number; maxStep?: number }) {
    const size = ringSize || 80
    const borderWidth = 6
    const { cSize, radius, max, value, text, percentage } = useRing(step, size, maxStep || 4, borderWidth)
    const name = getStatusName(statusId)
    return (
        <svg
            className={styles.progressRing}
            style={{ color: `var(--order-status-${name})` }}
            width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle className={styles.bgCircle} cx={cSize} cy={cSize} r={radius} strokeWidth={borderWidth} fill="none" />
            <circle className={styles.progressCircle} cx={cSize} cy={cSize} r={radius} strokeWidth={borderWidth} strokeDasharray={`${value} ${max}`} fill="none" />
            <text className={styles.percentage} x={text.x} y={text.y} textAnchor="middle">{ percentage }%</text>
        </svg>
    )
}

export function Orders({ orders, customerId }: { orders: OrderWithPayemntAndStatus[]; customerId: number }) {
    return (
        <ul>
            {
                orders.map(order => (
                    <li key={order.id}>
                        { order.id }
                    </li>
                ))
            }
        </ul>
    )
}

export function OrderCard({ order }: { order: OrderWithPayemntAndStatus }) {
    return (
        <div className={styles.orderCard}>

        </div>
    )
}