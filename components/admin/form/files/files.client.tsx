'use client'

import { useCallback, useState } from "react"
import styles from './files.module.css'
import {useDropzone} from 'react-dropzone'
import Image from "next/image"

export function FilesUpload() {
    const [ images, setImages ] = useState<string[]>([])
    const [uploadMessage, setUploadMessage] = useState<string | null>(null)
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
                setUploadMessage('File uploaded successfully')
            } else {
                setUploadMessage('File upload failed')
            }
        } catch (error: any) {
            setUploadMessage('Error uploading file')
            console.error('Error uploading file:', error.message)
        }
    }, [uploadMessage])
    const { getRootProps, getInputProps } = useDropzone({onDrop})

    return (
        <div className={styles.fileUpload}>
            <div { ...getRootProps() }>
                <input { ...getInputProps() } />
                <p>Drag & drop an image file here, or click to select one</p>
            </div>
            {uploadMessage && <p>{uploadMessage}</p>}
            <Image src="/public/uploads/1699961050578.jpeg" width={200} height={200} alt="image" />
            {
                images.map((img, index) => (
                    <Image key={index} src={img} width={200} height={200} alt="image" />
                ))
            }
        </div>
    )
}
