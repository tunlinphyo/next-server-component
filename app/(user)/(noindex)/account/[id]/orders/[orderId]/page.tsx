
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { PaginationSkileton } from '@/components/user/pagination/pagination.client'
import { Pagination } from '@/components/user/pagination/pagination.server'
import { withPadStart } from '@/libs/utils'

export const metadata: Metadata = {
    title: 'Order Detail',
}

export default async function Page({ params, searchParams }: {
    params: {
        id: string;
        orderId: string;
    },
    searchParams?: {
        page?: string;
    }
}) {
    const id = Number(params.id)
    const orderId = Number(params.orderId)
    const page = Number(searchParams?.page) ?? 1
    return (
        <PageContainer>
            <PageTitle title='Order Detail' />
        </PageContainer>
    )
}