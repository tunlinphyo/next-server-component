import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";

const scrollAtom = atom<Record<string | number, number>>({})

export function useXScroll(id: string | number) {
    const elemRef = useRef<HTMLDivElement | null>(null)
    const [scrollX, setScrollX] = useAtom(scrollAtom)

    useEffect(() => {
        if (elemRef.current) {
            elemRef.current.scrollTo(scrollX[id] || 0, 0)
        }
    }, [ elemRef ])

    const handleScroll = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement
        setScrollX({
            ...scrollX,
            [id]: target.scrollLeft
        })
    }

    return {
        elemRef,
        handleScroll
    }
}