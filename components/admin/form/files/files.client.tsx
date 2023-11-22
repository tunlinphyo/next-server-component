'use client'

import { useCallback, useEffect, useRef, useState } from "react"
import styles from './files.module.css'
import {useDropzone} from 'react-dropzone'
import Image from "next/image"
import { appToast } from "@/libs/toasts"
import { ArrowPathIcon, PhotoIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import { appConfirm } from "@/libs/modals"
import { removeCommonImages } from "./files.utils"

type ImageUploadProps = {
    name: string;
    defaultValue?: string[];
    children?: React.ReactNode;
}

type AvatarUploadProps = {
    name: string;
    defaultValue?: string[];
    children?: React.ReactNode;
}

export function ImageUpload({ children, name, defaultValue }: ImageUploadProps) {
    const [ loading, setLoading ] = useState(false)
    const [ images, setImages ] = useState(defaultValue || [])
    const [ toRemoves, setToRemoves ] = useState<string[]>([])
    const [ toDelImg, setToDelImg ] = useState<string | null>(null)
    const elemRef = useRef<HTMLDivElement | null>(null)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const formData = new FormData()
        formData.append('file', acceptedFiles[0])

        try {
            setLoading(true)
            const response = await fetch('/api/image/upload', {
                method: 'POST',
                body: formData,
            })
            setLoading(false)

            if (response.ok) {
                const result = await response.json()
                console.log('IMAGE_PATH', result)
                setImages([ ...images, result.data ])
                appToast('File uploaded successfully')
            } else {
                appToast('File upload failed')
            }
        } catch (error: any) {
            appToast(error.message)
            console.error('Error uploading file:', error.message)
        }
    }, [ images ])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
        },
        maxFiles: 1,
        multiple: false
    })

    const removeImage = async (image: string) => {
        setToDelImg(image)
        const result = await appConfirm('Are you sure to delete?')
        setToDelImg(null)
        if (result) {
            setToRemoves((previous) => [ ...previous, image ])
            setImages((previous) => previous.filter(img => img !== image))
        }
    }

    const handleReset = async () => {
        const defaults = defaultValue || []
        let prevImages: string[] = []
        await setImages((previous) => {
            prevImages = previous
            return defaults
        })
        await setToRemoves((previous) => Array.from(new Set([ ...previous, ...prevImages ])))
        await setToRemoves((previous) => removeCommonImages(previous, defaults))
        appToast('Images reset')
    }

    useEffect(() => {
        let formEl: HTMLFormElement | null
        if (elemRef.current) {
            formEl = elemRef.current.closest('form')
            formEl?.addEventListener('reset', handleReset)
        }
        return () => {
            formEl?.removeEventListener('reset', handleReset)
        }
    }, [ elemRef ])

    return (
        <div ref={elemRef} className={styles.fileUpload}>
            {
                toRemoves.map((img, index) => (
                    <input key={index} type="hidden" name="delete_images" defaultValue={img} />
                ))
            }
            <label htmlFor={name} className={styles.label}>{ children }</label>
            <div className={styles.imageGrid}>
                {
                    images.map((img, index) => (
                        <div className={styles.imageBox} key={index}>
                            <button
                                type="button"
                                className={styles.deleteIcon}
                                onClick={removeImage.bind(null, img)}
                                disabled={toDelImg === img}
                            >
                                { toDelImg === img ? <ArrowPathIcon className="icon-loading" /> : <TrashIcon /> }
                            </button>
                            <input type="hidden" name={name} defaultValue={img} />
                            <Image key={index} src={img} width={200} height={200} alt="image" />
                        </div>
                    ))
                }
                <div className={clsx(styles.imageBox, styles.addImage)}>
                    <div { ...getRootProps() } className={clsx(styles.iconConatiner, loading && styles.imageDisabled)}>
                        <input { ...getInputProps() } />
                        {
                            loading
                                ? <ArrowPathIcon className={clsx(styles.loadingIcon, "icon-loading")} />
                                : <>
                                    <PhotoIcon className={styles.photoIcon} />
                                    <PlusIcon className={styles.plusIcon} />
                                </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export function AvatarUpload({ children, name, defaultValue }: AvatarUploadProps) {
    const [ loading, setLoading ] = useState(false)
    const [ image, setImage ] = useState(defaultValue || null)
    const [ toRemoves, setToRemoves ] = useState<string[]>([])
    const [ toDelImg, setToDelImg ] = useState<string | null>(null)
    const elemRef = useRef<HTMLDivElement | null>(null)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const formData = new FormData()
        formData.append('file', acceptedFiles[0])

        try {
            setLoading(true)
            const response = await fetch('/api/image/upload', {
                method: 'POST',
                body: formData,
            })
            setLoading(false)

            if (response.ok) {
                const result = await response.json()
                console.log('IMAGE_PATH', result)
                setImage(result.data)
                appToast('File uploaded successfully')
            } else {
                appToast('File upload failed')
            }
        } catch (error: any) {
            appToast(error.message)
            console.error('Error uploading file:', error.message)
        }
    }, [ image ])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': [],
        },
        maxFiles: 1,
        multiple: false
    })

    const removeImage = async (image: string) => {
        setToDelImg(image)
        const result = await appConfirm('Are you sure to delete?')
        setToDelImg(null)
        if (result) {
            setToRemoves((previous) => [ ...previous, image ])
            setImage(null)
        }
    }

    const handleReset = async () => {
        const defaultImg = defaultValue || null
        let prevImage: string | null = null
        await setImage((previous) => {
            prevImage = previous
            return defaultImg
        })
        if (prevImage) {
            await setToRemoves((previous) => Array.from(new Set([ ...previous, prevImage || '' ])))
        }
        if (defaultImg) {
            await setToRemoves((previous) => removeCommonImages(previous, [ defaultImg ]))
        }
        appToast('Images reset')
    }

    useEffect(() => {
        let formEl: HTMLFormElement | null
        if (elemRef.current) {
            formEl = elemRef.current.closest('form')
            formEl?.addEventListener('reset', handleReset)
        }
        return () => {
            formEl?.removeEventListener('reset', handleReset)
        }
    }, [ elemRef ])

    return (
        <div ref={elemRef} className={styles.avatarUpload}>
            {
                toRemoves.map((img, index) => (
                    <input key={index} type="hidden" name="delete_images" defaultValue={img} />
                ))
            }
            <label htmlFor={name} className={styles.label}>{ children }</label>
            {
                image
                    ? (
                        <div className={styles.imageBox}>
                            <button
                                type="button"
                                className={styles.deleteIcon}
                                onClick={removeImage.bind(null, image)}
                                disabled={!!toDelImg}
                            >
                                { !!toDelImg ? <ArrowPathIcon className="icon-loading" /> : <TrashIcon /> }
                            </button>
                            <input type="hidden" name={name} defaultValue={image} />
                            <Image key={image} src={image} width={200} height={200} alt="image" />
                        </div>
                    ) : (
                        <div className={clsx(styles.imageBox, styles.addImage)}>
                            <div { ...getRootProps() } className={clsx(styles.iconConatiner, loading && styles.imageDisabled)}>
                                <input { ...getInputProps() } />
                                {
                                    loading
                                        ? <ArrowPathIcon className={clsx(styles.loadingIcon, "icon-loading")} />
                                        : <>
                                            <PhotoIcon className={styles.photoIcon} />
                                            <PlusIcon className={styles.plusIcon} />
                                        </>
                                }
                            </div>
                        </div>
                    )
            }
        </div>
    )
}