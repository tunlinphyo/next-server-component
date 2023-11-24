import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";

const scrollAtom = atom<number>(0)

export function useXScroll() {
    const elemRef = useRef<HTMLDivElement | null>(null)
    const [scrollX, setScrollX] = useAtom(scrollAtom)

    useEffect(() => {
        if (elemRef.current) {
            elemRef.current.scrollTo(scrollX || 0, 0)
        }
    }, [ elemRef ])

    const handleScroll = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement
        setScrollX(target.scrollLeft)
    }

    return {
        elemRef,
        handleScroll
    }
}