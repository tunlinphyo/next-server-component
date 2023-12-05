
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { FormSkeleton } from '@/components/user/form/form.client';
import { CustomerPayment } from './customer-payment.server';

export const metadata: Metadata = {
    title: 'Favourites',
}

export default async function Page({ params }: {
    params: {
        orderId: string;
        paymentId: string;
    },
}) {
    const { orderId, paymentId } = params
    return (
        <PageContainer>
            <PageTitle title={ paymentId == 'new' ? 'New Payment' : 'Edit Payment' } />
            <Suspense fallback={<FormSkeleton count={5} />}>
                <CustomerPayment orderId={orderId} paymentId={paymentId} />
            </Suspense>
        </PageContainer>
    )
}