
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { CustomerEdit } from './edit.server'
import { EditSkeleton } from './edit.client'

export const metadata: Metadata = {
    title: 'Favourites',
}

export default async function Home({ params }: {
    params: {
        id: string;
    },
}) {
    const id = Number(params.id)
    return (
        <PageContainer>
            <PageTitle title='Customer Info' />
            <Suspense fallback={<EditSkeleton />}>
                <CustomerEdit id={id} />
            </Suspense>
        </PageContainer>
    )
}