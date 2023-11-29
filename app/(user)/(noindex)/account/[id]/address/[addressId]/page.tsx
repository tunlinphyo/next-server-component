
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { AddressEdit } from './address.server';
import { AddressFormSkeleton } from './address.client';

export const metadata: Metadata = {
    title: 'Favourites',
}

export default async function Home({ params }: {
    params: {
        id: string;
        addressId: string;
    },
}) {
    const { id, addressId } = params
    return (
        <PageContainer>
            <PageTitle title={ addressId == 'new' ? 'New Address' : 'Edit Address' } />
            <Suspense fallback={<AddressFormSkeleton />}>
                <AddressEdit customerId={Number(id)} addressId={addressId} />
            </Suspense>
        </PageContainer>
    )
}