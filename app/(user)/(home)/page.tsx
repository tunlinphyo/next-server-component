
import { PageContainer, PageSubTitle, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { ServerCategories, ServerLatestProducts } from './home.server'
import { CategorySkeleton, ProductSlideSkeleton, SearchBar } from './home.client'

export default async function Home() {
    return (
        <PageContainer>
            <PageTitle title='Start Shopping' />
            <SearchBar />
            <PageSubTitle title='Categories' />
            <Suspense fallback={<CategorySkeleton />}>
                <ServerCategories />
            </Suspense>
            <PageSubTitle title='Popular Products' />
            <Suspense fallback={<ProductSlideSkeleton />}>
                <ServerLatestProducts />
            </Suspense>
        </PageContainer>
    )
}
