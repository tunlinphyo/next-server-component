
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { ServerProducts } from './products.server'
import { ProductsSkeleton } from './products.client'

export default async function Home() {
    return (
        <PageContainer>
            <PageTitle title='Product List' />
            <Suspense fallback={<ProductsSkeleton count={6} />}>
                <ServerProducts />
            </Suspense>
        </PageContainer>
    )
}