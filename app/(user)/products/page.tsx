
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { ServerProducts } from './products.server'
import { ProductsSkeleton } from './products.client'
import { PaginationSkileton } from '@/components/user/pagination/pagination.client'
import { Pagination } from '@/components/user/pagination/pagination.server'
import { getProductPageLength } from './products.action'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Products',
    description: 'Product list page'
}

export default async function Home({ searchParams }: {
    searchParams?: {
        page?: string;
        query?: string;
        category?: string;
    }
}) {
    const query = searchParams?.query || ''
    const category = Number(searchParams?.category) ?? undefined
    const page = Number(searchParams?.page) ?? 1
    return (
        <PageContainer>
            <PageTitle title='Product List' />
            <Suspense key={page + query + category} fallback={<ProductsSkeleton count={6} />}>
                <ServerProducts page={page} query={query} categoryId={category} />
            </Suspense>
            <Suspense fallback={<PaginationSkileton />}>
                <Pagination action={getProductPageLength.bind(null, query, category)} />
            </Suspense>
        </PageContainer>
    )
}