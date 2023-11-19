
import { ChildrenProp } from '@/libs/definations'
import './user.css'
import styles from './user.module.css'
import Link from 'next/link'
import { ArrowLongRightIcon } from '@heroicons/react/24/outline'
import { CartIconSkeleton, NavigationSkeleton, PageFooter, PageHeader, UserLinkSkeleton } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { ServerCartIcon, ServerNavigation, ServerUser } from './user.server'
import { ScrollView } from '@/components/user/scroll-view/scroll-view.client'
import { ToastGroup } from '@/components/user/toast/toast.client'
import { Metadata } from 'next'

export const metadata: Metadata = {
    metadataBase: new URL(process.env.APP_URL as string),
    title: {
        template: '%s | Shoppy',
        default: 'Shoppy',
    },
    description: 'Shoppy shopping webapp',
    applicationName: 'Shoppy',
    // referrer: 'origin-when-cross-origin',
    keywords: ['Next.js', 'React', 'JavaScript', 'Server Component'],
    authors: [{ name: 'Tun Lin Phyo', url: 'https://tun-lin-phyo.web.app/' }],
    creator: 'Tun Lin Phyo',
    publisher: 'Tun Lin Phyo',
    openGraph: {},
    twitter: {},
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

export default async function Layout({ children }: ChildrenProp) {
    return (
        <>
            <main id="user" className={styles.main}>
                <ScrollView>
                    <div className={styles.safeView}>
                        <PageHeader
                            navigations={
                                <Suspense fallback={<NavigationSkeleton />}>
                                    <ServerNavigation />
                                </Suspense>
                            }
                        >
                            <Suspense fallback={<CartIconSkeleton />}>
                                <ServerCartIcon />
                            </Suspense>
                            <Suspense fallback={<UserLinkSkeleton />}>
                                <ServerUser />
                            </Suspense>
                        </PageHeader>
                        {children}
                        <PageFooter />
                    </div>
                </ScrollView>
                <ToastGroup />
            </main>
            <Link href="/admin" className='site-change-link'>
                go to admin <ArrowLongRightIcon />
            </Link>
        </>
    )
}