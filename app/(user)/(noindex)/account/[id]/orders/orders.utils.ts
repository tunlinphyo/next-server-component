import { ORDER_STATUS_CANCEL, ORDER_STATUS_DELIVERED, ORDER_STATUS_NEW, ORDER_STATUS_PAID, ORDER_STATUS_PENDING, ORDER_STATUS_RETURN } from "@/libs/const"

export function getStatusName(statusId: number) {
    switch(statusId) {
        case ORDER_STATUS_PENDING: return 'pending'
        case ORDER_STATUS_NEW: return 'new'
        case ORDER_STATUS_PAID: return 'paid'
        case ORDER_STATUS_DELIVERED: return 'delivered'
        case ORDER_STATUS_RETURN: return 'return'
        case ORDER_STATUS_CANCEL: return 'cancel'
        default: return 'pending'
    }
}

export function getStatusStep(statusId: number) {
    switch(statusId) {
        case ORDER_STATUS_PENDING: return 1
        case ORDER_STATUS_NEW: return 2
        case ORDER_STATUS_PAID: return 3
        case ORDER_STATUS_DELIVERED: return 4
        default: return 4
    }

}

export function useRing(step: number, size: number, steps: number, width: number) {
    const cSize = size / 2
    const radius = cSize - (width / 2)
    const text = {
        x: cSize + (width / 2),
        y: cSize + width,
    }
    const max = 2 * Math.PI * radius
    const stepValue = Math.round(max / steps)
    const value = Math.floor(stepValue * step)
    const percentage = Math.floor(100 / steps * Math.min(steps, step))

    return {
        cSize,
        radius,
        max,
        value,
        text,
        percentage
    }
}
