'use client'

import { useAtom } from "jotai"
import { ToastGroupAtom, addToast, createToast, readonlyToastGroup, removeToast } from "./toast.utils"
import { useAtomValue } from "jotai/react"
import { wait } from "@/libs/utils"


export function useInitToast() {
    const [ _, setToastGroup ] = useAtom(ToastGroupAtom)

    return { setToastGroup }
}

export function useToast() {
    const ToastGroup = useAtomValue(readonlyToastGroup)

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

    async function showToasts(texts: string[], delay: number = 200) {
        for await(const text of texts) {
            await wait(delay)
            showToast(text)
        }
    }

    return {
        showToast,
        showToasts,
    }
}
