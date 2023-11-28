
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { FooterBar, ProgressBar } from '../checkout.client';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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
            <div style={{
                height: '1000px'
            }} />
            <FooterBar>
                <Link href="/cart/checkout/1/success" className="button">
                    Checkout 
                    <CheckCircleIcon />
                </Link>
            </FooterBar>
        </PageContainer>
    )
}