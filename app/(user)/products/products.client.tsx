'use client'

import styles from './products.module.css'
import Image from 'next/image'
import { ArrowPathIcon, HeartIcon, ListBulletIcon, NoSymbolIcon, PhotoIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { formatPrice } from '@/libs/utils'
import { TextSkeleton } from '@/components/user/utils/utils.client'
import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { addToCart, setFabourite } from './products.action'
import clsx from 'clsx'
import { BottomSheetContainer, Modal } from '@/components/user/modals/modals.client'
import { usePathname } from 'next/navigation'
import { useToast } from '@/components/user/toast/toast.index'
import { ProductClassWithVariants, ProductWithPriceAndStock } from './product.interface'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/20/solid'
import { useIntersectionObserver } from '@/libs/intersection-observer'

type AddToCartFormProps = {
    productClass: ProductClassWithVariants[];
}

export function Products({ children }: { children: React.ReactNode }) {
    const childrenCount = React.Children.count(children)
    const ulRef = useRef<HTMLUListElement | null>(null)

    useEffect(() => {
        const { observe, unobserve } = useIntersectionObserver(ulRef?.current, entry => {
            entry.target.classList.toggle("observer-inview", entry.isIntersecting)
        })
        observe()

        return () => {
            unobserve()
        }
    }, [])

    return (
        <ul ref={ulRef} className={styles.products}>
            { children }
            { childrenCount === 1 && <div /> }
        </ul>
    )
}

export function ProductLi({ children }: { children: React.ReactNode }) {
    return <li>{ children }</li>
}

export function Product({ product, observeable, children }: { product: ProductWithPriceAndStock, observeable?: boolean, children?: React.ReactNode }) {

    return (
        <div className={clsx(styles.product, observeable && 'observer-scale')}>
            <Link href={`/products/${product.id}`} className={styles.productImage}>
                {
                    (product.images && product.images.length)
                        ? <Image src={product.images[0].imgUrl} width={200} height={200} alt='product image' />
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
            { children }
            <div className={styles.productAction}>
                {
                    product.productClasses && product.quantity
                        ? <AddToCartForm productClass={product.productClasses} />
                        : <OutofStockButton />
                }
            </div>
        </div>
    )
}

export function FavouriteToggleForm({ productId, customerId, is }: { productId: number; customerId: number; is: boolean }) {
    const pathname = usePathname()
    const { showToast } = useToast()
    const [ state, onAction ] = useFormState(setFabourite.bind(null, {
        customerId,
        productId,
        is: !is,
        pathname
    }), { code: '' })

    useEffect(() => {
        if (state.code) showToast(state.code)
    }, [ state ])

    return (
        <div className={styles.favouriteContainer}>
            <form action={onAction}>
                <FavouriteButton is={is} />
            </form>
        </div>
    )
}

export function FavouriteSkeleton() {
    return (
        <div className={styles.favouriteContainer}>
            <div className={styles.favouriteSkeletom} />
        </div>
    )
}

export function FavouriteContainer({ children }: { children: React.ReactNode }) {
    return <div className={styles.favouriteContainer}>{ children }</div>
}

function FavouriteButton({ is }: { is: boolean }) {
    const { pending } = useFormStatus()
    return (
        <button className={styles.favourite} disabled={pending}>
            { pending ? <ArrowPathIcon className="icon-loading" /> : (is ? <HeartIconSolid /> : <HeartIcon />) }
        </button>
    )
}

export function OutofStockButton() {
    return (
        <button className={styles.addToCart} disabled={true}>
            out of stock <NoSymbolIcon />
        </button>
    )
}

export function AddToCartButton({ id, onChange }: { id: number; onChange: () => void }) {
    const { pending } = useFormStatus()
    return (
        <label className={clsx(styles.addToCart, pending && styles.addToCartDisabled)}>
            <input type='radio' name='class_id' defaultValue={id} onChange={onChange} />
            add to cart { pending ? <ArrowPathIcon className="icon-loading" /> : <ShoppingBagIcon /> }
        </label>
    )
}

export function ModalOpenButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="button"
            className={styles.addToCart}
            disabled={(loading || pending)}
            onClick={onClick}
        >
            add to cart { (loading || pending) ? <ArrowPathIcon className="icon-loading" /> : <ShoppingBagIcon /> }
        </button>
    )

}

export function AddToCartForm({ productClass }: AddToCartFormProps) {
    const [ state, onAction ] = useFormState(addToCart, { code: '' })
    const [ modal, setModal ] = useState(false)
    const pathname = usePathname()
    const formRef = useRef<HTMLFormElement | null>(null)
    const { showToast } = useToast()

    const handleChange = useCallback(() => {
        setModal(false)
        formRef.current?.requestSubmit()
        formRef.current?.reset()
    }, [])

    useEffect(() => {
        if (state.code) showToast(state.code)
    }, [ state ])

    return (
        <>
            <form ref={formRef} action={onAction} className={styles.addToCartForm}>
                <input type='hidden' name='pathname' defaultValue={pathname} />
                {
                    (productClass.length == 1 && !productClass[0].variant1Id)
                        ? (
                            <AddToCartButton id={productClass[0].id} onChange={handleChange} />
                        ) : (
                            <>
                                <ModalOpenButton loading={modal} onClick={() => setModal(true)} />
                                {
                                    productClass.map(item => (
                                        <input
                                            key={item.id}
                                            id={`class_id_${item.id}`}
                                            type="radio"
                                            name="class_id"
                                            defaultValue={item.id}
                                            disabled={!item.quantity}
                                            onChange={handleChange} />
                                    ))
                                }
                            </>
                        )
                }
            </form>
            <Modal open={modal}>
                <BottomSheetContainer onClose={() => setModal(false)}>
                    {
                        productClass.map(item => (
                            <label
                                key={item.id}
                                htmlFor={`class_id_${item.id}`}
                                className={clsx(styles.bottomSheetButton, !item.quantity && styles.bottomSheetDisabled )}
                            >
                                <ListBulletIcon />
                                <span className={styles.variantsContiner}>
                                    <span>{ item.variant1?.name }</span>
                                    { item.variant2 && ' - ' }
                                    <span>{ item.variant2?.name }</span>
                                </span>
                                <span>{ formatPrice(item.price) }</span>
                            </label>
                        ))
                    }
                </BottomSheetContainer>
            </Modal>
        </>
    )
}

// export function AddToCartFormBackup({ productClass }: AddToCartFormProps) {
//     const [ modal, setModal ] = useState(false)
//     const [ loading, setLoading ] = useState(false)
//     const pathname = usePathname()
//     const { showToast } = useToast()

//     const openModal = () => {
//         setLoading(true)
//         setModal(true)
//     }

//     const closeModal = () => {
//         setModal(false)
//         setLoading(false)
//     }

//     const handleSubmit = async (id: number) => {
//         setModal(false)
//         setLoading(true)
//         const result = await addToCart(id, pathname)
//         setLoading(false)
//         if (result.code) showToast(result.code)
//     }

//     return (
//         <>
//             <div className={styles.buttonContainer}>
//                 {
//                     (productClass.length == 1 && !productClass[0].variant_1_id)
//                         ? <ModalOpenButton loading={loading} onClick={() => handleSubmit(productClass[0].id)} />
//                         : <ModalOpenButton loading={loading} onClick={openModal} />
//                 }
//             </div>
//             <Modal open={modal}>
//                 <BottomSheetContainer onClose={closeModal}>
//                     {
//                         productClass.map(item => (
//                             <BottomSheetButton
//                                 onClick={() => handleSubmit(item.id)}
//                                 key={item.id}
//                                 disabled={!item.quantity}>
//                                 <ListBulletIcon />
//                                 <span className={styles.variantsContiner}>
//                                     <span>{ item.variant1?.name }</span>
//                                     { item.variant2 && ' - ' }
//                                     <span>{ item.variant2?.name }</span>
//                                 </span>
//                                 <span>{ formatPrice(item.price) }</span>
//                             </BottomSheetButton>
//                         ))
//                     }
//                 </BottomSheetContainer>
//             </Modal>
//         </>
//     )
// }

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
        <div className={clsx(styles.product, 'skeleton')}>
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
