import { ChildrenProp } from "@/libs/definations"
import { Metadata } from 'next'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
}


export default async function Layout({ children }: ChildrenProp) {
    return (
        <>{ children }</>
    )
}