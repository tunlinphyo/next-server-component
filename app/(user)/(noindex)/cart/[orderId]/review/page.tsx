
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { ProgressBar } from '../checkout.client'
import { Review } from './review.server'

export const metadata: Metadata = {
    title: 'Checkout',
}

export default async function Home({ params }: {
    params: {
        orderId: string;
    },
}) {
    const orderId = Number(params.orderId)
    return (
        <PageContainer>
            <PageTitle title='Review' />
            <ProgressBar step={3} />
            <Suspense fallback={<div>LOADING...</div>}>
                <Review orderId={orderId} />
            </Suspense>
        </PageContainer>
    )
}