import { Toast, Toasts } from "./toast"

export function appToast(msg: string) {
    return Toast(msg)
}

export function appToasts(messages: string[], wait:number = 300) {
    return Toasts(messages, wait)
}
