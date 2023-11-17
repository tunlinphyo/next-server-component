
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { LoginSkeleton } from './login.client'
import { Suspense } from 'react'
import { ServerLogin } from './login.server'

export default async function Page() {
    return (
        <PageContainer>
            <PageTitle title='Login Register' />
            <Suspense fallback={<LoginSkeleton />}>
                <ServerLogin />
            </Suspense>
        </PageContainer>
    )
}