'use client'

import { useCallback, useState } from "react"
import styles from './files.module.css'
import {useDropzone} from 'react-dropzone'
import Image from "next/image"
import { ChildrenProp } from "@/libs/definations"
import { appToast } from "@/libs/toasts"
import { PhotoIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import { appConfirm } from "@/libs/modals"

type ImageUploadProps = {
    name: string;
    defaultValue?: string[];
    children?: React.ReactNode;
}

export function ImageUpload({ children, name, defaultValue }: ImageUploadProps) {
    const [ images, setImages ] = useState(defaultValue || [])
    const [ toRemoves, setToRemoves ] = useState<string[]>([])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const formData = new FormData()
        formData.append('file', acceptedFiles[0])

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

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
        maxFiles: 1
    })

    const removeImage = async (image: string) => {
        const result = await appConfirm('Are you sure to delete?')
        if (result) {
            setToRemoves([ ...toRemoves, image ])
            const newImages = images.filter(img => img !== image)
            setImages(newImages)
        }
    }

    return (
        <div className={styles.fileUpload}>
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
                                onClick={removeImage.bind(null, img)}>
                                <TrashIcon />
                            </button>
                            <input type="hidden" name={name} defaultValue={img} />
                            <Image key={index} src={img} width={200} height={200} alt="image" />
                        </div>
                    ))
                }
                <div className={clsx(styles.imageBox, styles.addImage)}>
                    <div { ...getRootProps() } className={styles.iconConatiner}>
                        <input { ...getInputProps() } />
                        <PhotoIcon className={styles.photoIcon} />
                        <PlusIcon className={styles.plusIcon} />
                    </div>
                </div>
            </div>
        </div>
    )
}
