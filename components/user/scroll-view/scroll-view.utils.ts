'use client'

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { atom, useAtom } from 'jotai'

export type UserPageHistory = {
    [key: string]: number;
}
const historyAtom = atom<UserPageHistory>({})

export function usePageScrollPosition(elem: React.MutableRefObject<HTMLDivElement | null>) {
    const pathname = usePathname()
    const params = useSearchParams().toString()
    const [history, setHistory] = useAtom(historyAtom)
    
    useEffect(() => {
        setTimeout(() => {
            const key = pathname + params
            console.log(key, history[key])
            if (history[key]) {
                elem.current?.scrollTo(0, history[key])
            } else {
                elem.current?.scrollTo(0, 0)
            }
        })
    }, [ pathname, params ])

    function handleScroll(event: React.MouseEvent<HTMLDivElement>) {
        const targetEl = event.target as HTMLDivElement
        const scrollTop = targetEl.scrollTop
        const key = pathname + params
        setHistory({ ...history, [key]: scrollTop })
    }
 
    return handleScroll
}