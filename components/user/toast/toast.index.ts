'use client'

import { atom, useAtom } from "jotai"
import { addToast, createToast, removeToast } from "./toast.utils"

const ToastGroupAtom = atom<HTMLElement | null>(null)

export function useInitToast() {
    const [ _, setToastGroup ] = useAtom(ToastGroupAtom)

    return { setToastGroup }
}

export function useToast() {
    const [ ToastGroup ] = useAtom(ToastGroupAtom)

    function showToast(text: string) {
        if (!ToastGroup) return
        let toast = createToast(text)
        addToast(ToastGroup, toast)

        return new Promise(async (resolve) => {
            await Promise.allSettled(
                toast.getAnimations().map(animation =>
                    animation.finished
                )
            )
            removeToast(ToastGroup, toast)
            resolve(text)
        })
    }

    return {
        showToast
    }
}
