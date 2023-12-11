"use client"

export function useIntersectionObserver(parent: HTMLElement | null, callback: (entry: IntersectionObserverEntry) => void, threshold: number = .5) {
    const observer = new IntersectionObserver(entires => {
        for (const entry of entires) {
            callback(entry)
        }
    }, {
        threshold
    })

    function observe() {
        if (!parent) return
        Array.from(parent.children).forEach(child => {
            observer.observe(child)
        })
    }

    function unobserve() {
        if (!parent) return
        Array.from(parent.children).forEach(child => {
            observer.unobserve(child)
        })
    }

    return {
        observe,
        unobserve,
    }
}