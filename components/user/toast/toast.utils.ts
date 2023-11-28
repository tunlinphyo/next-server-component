
import { atom } from "jotai"

export const ToastGroupAtom = atom<HTMLElement | null>(null)
export const readonlyToastGroup = atom((get) => get(ToastGroupAtom))

export function createToast(text:string) {
    const node = document.createElement('output')

    node.innerText = text
    node.setAttribute('role', 'status')
    node.setAttribute('aria-live', 'polite')

    return node
}

export function removeToast(Toaster: HTMLElement, toast:HTMLOutputElement) {
    Toaster?.removeChild(toast)
}

export const addToast = (Toaster: HTMLElement, toast:HTMLOutputElement) => {
    const { matches: motionOK } = window.matchMedia(
        '(prefers-reduced-motion: no-preference)'
    )

    Toaster.children.length && motionOK
        ? flipToast(Toaster, toast)
        : Toaster.appendChild(toast)
}

// https://aerotwist.com/blog/flip-your-animations/
const flipToast = (Toaster:HTMLElement, toast:HTMLOutputElement) => {
    const first = Toaster.offsetHeight
    Toaster.appendChild(toast)
    const last = Toaster.offsetHeight
    const invert = last - first

    const animation = Toaster.animate([
        { transform: `translateY(${invert}px)` },
        { transform: 'translateY(0)' }
    ], {
        duration: 150,
        easing: 'ease-out',
    })

    animation.startTime = document.timeline.currentTime
}
