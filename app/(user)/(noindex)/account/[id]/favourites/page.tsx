
import { PageContainer, PageTitle } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { ProductsSkeleton } from '@/app/(user)/products/products.client'
import { ServerFavouriteProducts } from './favourites.server'
import { PaginationSkileton } from '@/components/user/pagination/pagination.client'
import { Pagination } from '@/components/user/pagination/pagination.server'
import { getFavouritesPageLength } from '../../account.actions'

export const metadata: Metadata = {
    title: 'Favourites',
}

export default async function Home({ params, searchParams }: {
    params: {
        id: string;
    },
    searchParams?: {
        page?: string;
    }
}) {
    const id = Number(params.id)
    const page = Number(searchParams?.page) ?? 1
    return (
        <PageContainer>
            <PageTitle title='Favourite Products' />
            <Suspense key={page} fallback={<ProductsSkeleton count={6} />}>
                <ServerFavouriteProducts id={id} page={page} />
            </Suspense>
            <Suspense fallback={<PaginationSkileton />}>
                <Pagination action={getFavouritesPageLength.bind(null, id)} />
            </Suspense>
        </PageContainer>
    )
}