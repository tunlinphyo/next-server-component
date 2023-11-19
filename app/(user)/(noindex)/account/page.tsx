
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { ServerLogoutForm } from './account.server'
import { LogoutFormSkeleton } from './account.client'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Account',
}

export default async function Home() {
    return (
        <PageContainer>
            <Suspense fallback={
                <>
                    <PageTitle title='User Account' />
                    <LogoutFormSkeleton />
                </>
            }>
                <ServerLogoutForm />
            </Suspense>
        </PageContainer>
    )
}