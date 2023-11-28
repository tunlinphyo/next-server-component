
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { FooterBar, ProgressBar } from '../checkout.client';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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
            <div style={{
                height: '1000px'
            }} />
            <FooterBar>
                <Link href="/cart/checkout/review" className="button">
                    Review 
                    <ArrowRightCircleIcon />
                </Link>
            </FooterBar>
        </PageContainer>
    )
}