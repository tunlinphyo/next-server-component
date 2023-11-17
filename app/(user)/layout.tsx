
import { ChildrenProp } from '@/libs/definations'
import './user.css'
import styles from './user.module.css'
import Link from 'next/link'
import { ArrowLongRightIcon } from '@heroicons/react/24/outline'
import { CartIconSkeleton, NavigationSkeleton, PageFooter, PageHeader, UserLinkSkeleton } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { ServerCartIcon, ServerNavigation, ServerUser } from './user.server'

export default async function Layout({ children }: ChildrenProp) {
    return (
        <>
            <main id="user" className={styles.main}>
                <div className={styles.scrollView}>
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
                </div>
            </main>
            <Link href="/admin" className='site-change-link'>
                go to admin <ArrowLongRightIcon />
            </Link>
        </>
    )
}