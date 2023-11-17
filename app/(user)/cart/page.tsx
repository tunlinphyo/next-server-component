
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { ServerCart } from './cart.server'
import { CartSkeleton } from './cart.client'

export default async function Home() {
    return (
        <PageContainer>
            <PageTitle title='Cart' />
            <Suspense fallback={<CartSkeleton count={4} />}>
                <ServerCart />
            </Suspense>
        </PageContainer>
    )
}