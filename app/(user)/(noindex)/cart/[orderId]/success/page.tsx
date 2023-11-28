
import { PageContainer, PageSubTitle, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { ProgressBar } from '../checkout.client'

export const metadata: Metadata = {
    title: 'Checkout',
}

export default async function Page({ params }: {
    params: {
        orderId: string;
    },
}) {
    const orderId = Number(params.orderId)
    return (
        <PageContainer>
            <PageTitle title='Order Success' />
            <ProgressBar step={4} />
            <PageSubTitle title="Order success!!" />
        </PageContainer>
    )
}