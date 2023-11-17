'use client'

import { ProductClassType, ProductType } from '@/libs/definations'
import styles from './products.module.css'
import Image from 'next/image'
import { ArrowPathIcon, ListBulletIcon, NoSymbolIcon, PhotoIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '@/libs/utils'
import { TextSkeleton } from '@/components/user/utils/utils.client'
import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { appToast } from '@/libs/toasts'
import { addToCart } from './products.action'
import clsx from 'clsx'
import { BottomSheetButton, BottomSheetContainer, Modal } from '@/components/user/modals/modals.client'

type AddToCartFormProps = {
    product: ProductType;
    productClass: ProductClassType[];
}

export function Products({ products }: { products: ProductType[] }) {
    return (
        <ul className={styles.products}>
            {
                products.map(product => (
                    <li key={product.id}>
                        <Product product={product} />
                    </li>
                ))
            }
        </ul>
    )
}

export function Product({ product }: { product: ProductType }) {
    return (
        <div className={styles.product}>
            <Link href={`/products/${product.id}`} className={styles.productImage}>
                {
                    (product.images && product.images.length)
                        ? <Image src={product.images[product.images.length - 1]} width={200} height={200} alt='product image' />
                        : <PhotoIcon />
                }
            </Link>
            <Link href={`/products/${product.id}`} className={styles.productDetail}>
                <h4>{ product.name }</h4>
                <small className={styles.productPrice}>
                    { formatPrice(product.minPrice) }
                    { product.minPrice != product.maxPrice && <span>~</span> }
                    { product.minPrice != product.maxPrice && formatPrice(product.maxPrice) }
                </small>
            </Link>
            <div className={styles.productAction}>
                {
                    product.classes && product.quantity 
                        ? <AddToCartForm product={product} productClass={product.classes} />
                        : <OutofStockButton />
                }
            </div>
        </div>
    )
}

export function OutofStockButton() {
    return (
        <button className={styles.addToCart} disabled={true}>
            out of stock <NoSymbolIcon />
        </button>
    )
}

export function AddToCartButton() {
    const { pending } = useFormStatus()
    return (
        <button className={styles.addToCart} disabled={pending}>
            add to cart { pending ? <ArrowPathIcon className="icon-loading" /> : <ShoppingBagIcon /> }
        </button>
    )
}

export function ModalOpenButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="button"
            className={styles.addToCart}
            disabled={pending || loading}
            onClick={onClick}
        >
            add to cart { (pending || loading) ? <ArrowPathIcon className="icon-loading" /> : <ShoppingBagIcon /> }
        </button>
    )

}

export function AddToCartForm({ product, productClass }: AddToCartFormProps) {
    const formEl = useRef<HTMLFormElement | null>(null)
    const [ state, onAction ] = useFormState(addToCart, { code: '' })
    const [ modal, setModal ] = useState(false)
    const [ classId, setClassId ] = useState(productClass[0].id)

    useEffect(() => {
        if (state.code) appToast(state.code)
    }, [ state ])

    const handleSubmit = useCallback((id: number) => {
        setClassId(id)
        setTimeout(() => {
                if (formEl.current) {
                formEl.current.requestSubmit()
                setModal(false)
            }
        }, 0)
    }, [ classId ])

    return (
        <>
            <form ref={formEl} action={onAction}>
                <input type="hidden" name="class_id" defaultValue={classId} />
                {
                    (productClass.length == 1 && !productClass[0].variant_1_id)
                        ? <AddToCartButton /> : <ModalOpenButton loading={modal} onClick={() => setModal(true)} />
                }
            </form>
            <Modal open={modal}>
                <BottomSheetContainer onClose={() => setModal(false)}>
                    {
                        productClass.map(item => (
                            <BottomSheetButton onClick={() => handleSubmit(item.id)} key={item.id} disabled={!item.quantity}>
                                <ListBulletIcon />
                                <span style={{ flex: 1 }}>
                                    { item.variant1?.name } { item.variant2 && ' - ' } { item.variant2?.name }
                                </span>
                                <span>{ formatPrice(item.price) }</span>
                            </BottomSheetButton>
                        ))
                    }
                </BottomSheetContainer>
            </Modal>
        </>
    )
}

export function ProductsSkeleton({ count }: { count: number }) {
    const products = new Array(count).fill(1)
    return (
        <ul className={styles.products}>
            {
                products.map((product, index) => (
                    <li key={index}>
                        <ProductSkeleton />
                    </li>
                ))
            }
        </ul>
    )
}

export function ProductSkeleton() {
    return (
        <div className={styles.product}>
            <div className={styles.productImage}>
                <PhotoIcon />
            </div>
            <div className={styles.productDetail}>
                <TextSkeleton fontSizeEm={.8} width={120} top={2} />
                <TextSkeleton fontSizeEm={.6} top={5} />
            </div>
            <div className={styles.productAction}>
                <div className={clsx(styles.addToCart, styles.buttonSkeleton)}></div>
            </div>
        </div>
    )
}
