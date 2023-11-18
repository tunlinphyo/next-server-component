
import { PageContainer, PageSubTitle, PageTitle } from '@/components/user/utils/utils.client'
import styles from './home.module.css'
import Link from 'next/link'
import { Suspense } from 'react'
import { ServerLatestProducts } from './home.server'
import { Categories, ProductSlideSkeleton, SearchBar } from './home.client'

export default async function Home() {
    return (
        <PageContainer>
            <PageTitle title='Start Shopping' />
            <SearchBar />
            <PageSubTitle title='Categories' />
            <Categories />
            <PageSubTitle title='Popular Products' />
            <Suspense fallback={<ProductSlideSkeleton />}>
                <ServerLatestProducts />
            </Suspense>
        </PageContainer>
    )
}
