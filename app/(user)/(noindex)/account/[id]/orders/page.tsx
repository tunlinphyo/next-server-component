
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { PaginationSkileton } from '@/components/user/pagination/pagination.client'
import { Pagination } from '@/components/user/pagination/pagination.server'
import { getOrdersPageLength } from '../../account.actions'
import { ServerOrdres } from './orders.server'

export const metadata: Metadata = {
    title: 'Favourites',
}

export default async function Page({ params, searchParams }: {
    params: {
        id: string;
    },
    searchParams?: {
        page?: string;
    }
}) {
    const id = Number(params.id)
    const page = Number(searchParams?.page) ?? 1
    return (
        <PageContainer>
            <PageTitle title='Order History' />
            <Suspense key={page} fallback={<div>LOADING...</div>}>
                <ServerOrdres id={id} page={page} />
            </Suspense>
            <Suspense fallback={<PaginationSkileton />}>
                <Pagination action={getOrdersPageLength.bind(null, id)} />
            </Suspense>
        </PageContainer>
    )
}