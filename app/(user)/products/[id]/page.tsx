
import { PageContainer } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { ServerProduct } from './product.server'
import { GallerySkeleton } from './gallery/gallery.client'
import { TitleSkeleton } from './product.client'

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    return (
        <PageContainer>
            <Suspense fallback={
                <>
                    <GallerySkeleton />
                    <TitleSkeleton />
                </>
            }>
                <ServerProduct id={id} />
            </Suspense>
        </PageContainer>
    )
}