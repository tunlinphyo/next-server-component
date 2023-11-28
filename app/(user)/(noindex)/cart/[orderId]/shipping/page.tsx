
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { FooterBar, ProgressBar } from '../checkout.client';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ServerShipping } from './shipping.server';

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
            <Suspense fallback={<div>LOADING..</div>}>
                <ServerShipping />
            </Suspense>
            <FooterBar>
                <Link href="/cart/checkout/payment" className="primary-button fill">
                    Payment 
                    <CreditCardIcon />
                </Link>
            </FooterBar>
        </PageContainer>
    )
}