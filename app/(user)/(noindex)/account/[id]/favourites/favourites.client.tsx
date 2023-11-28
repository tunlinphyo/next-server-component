'use client'

import { useEffect } from 'react';
import styles from './favourites.module.css'
import { usePathname } from 'next/navigation'
import { useToast } from '@/components/user/toast/toast.index'
import { useFormState, useFormStatus } from 'react-dom'
import { setFabourite } from '@/app/(user)/products/products.action'
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { FavouriteContainer } from '@/app/(user)/products/products.client'

export function RemoveFavouriteForm({ productId, customerId }: { productId: number; customerId: number; }) {
    const pathname = usePathname()
    const { showToast } = useToast()
    const [ state, onAction ] = useFormState(setFabourite.bind(null, {
        customerId,
        productId,
        is: false,
        pathname
    }), { code: '' })

    useEffect(() => {
        if (state.code) showToast(state.code)
    }, [ state ])

    return (
        <FavouriteContainer>
            <form action={onAction}>
                <RemoveButton />
            </form>
        </FavouriteContainer>
    )
}

function RemoveButton() {
    const { pending } = useFormStatus()
    return (
        <button className={styles.favourite} disabled={pending}>
            { pending ? <ArrowPathIcon className="icon-loading" /> : <XMarkIcon /> }
        </button>
    )
}
