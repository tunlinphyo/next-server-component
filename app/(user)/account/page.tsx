
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { ServerLogoutForm } from './account.server'
import { LogoutFormSkeleton } from './account.client'

export default async function Home() {
    return (
        <PageContainer>
            <PageTitle title='User Account' />
            <Suspense fallback={<LogoutFormSkeleton />}>
                <ServerLogoutForm />
            </Suspense>
        </PageContainer>
    )
}