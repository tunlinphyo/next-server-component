
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { ProgressBar } from '../checkout.client'
import { Payment } from './payment.server'

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
            <PageTitle title='Payment' />
            <ProgressBar step={2} />
            <Suspense fallback={<div>LOADING..</div>}>
                <Payment orderId={orderId} />
            </Suspense>
        </PageContainer>
    )
}