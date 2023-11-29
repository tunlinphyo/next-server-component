
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { ProgressBar } from '../checkout.client'
import { ServerShipping } from './shipping.server'
import { ShippingSkeleton } from './shipping.client'

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
            <PageTitle title='Shipping' />
            <ProgressBar step={1} />
            <Suspense fallback={<ShippingSkeleton />}>
                <ServerShipping orderId={orderId} />
            </Suspense>
        </PageContainer>
    )
}