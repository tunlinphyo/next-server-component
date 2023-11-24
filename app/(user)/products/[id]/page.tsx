
import { PageContainer } from '@/components/user/utils/utils.client'
import { Suspense } from 'react'
import { ServerProduct } from './product.server'
import { GallerySkeleton } from './gallery/gallery.client'
import { TitleSkeleton } from './product.client'
import { Metadata } from 'next'
import { getMetadata } from './product.actions'

type Props = {
    params: {
        id: string;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = Number(params.id)
    const product = await getMetadata(id)
    if (!product) return {}
    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            url: `${process.env.APP_URL}${product.id}`,
            siteName: 'Shoppy',
            images: product.images?.map(img => ({
                url: `${process.env.APP_URL}${img.imgUrl}`
            })),
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.description,
            siteId: '1467726470533754880',
            creator: '@tun',
            creatorId: '1467726470533754880',
            images: product.images.map(item => item.imgUrl),
        },
        robots: {
            nocache: true,
        }
    }
}

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