'use server'

import path from "path"
import fs, { promises as fsPromises } from "fs"
import { IMAGE_UPLOAD_DIR } from "./const"

export async function saveImage(file: File) {
    const extension = _getFileExtension(file)
    const fileName = `${Date.now()}.${extension}`
    const destinationPath = path.join(IMAGE_UPLOAD_DIR, fileName)

    try {
        const imageBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(imageBuffer)
        fs.writeFileSync(destinationPath, buffer)
        return _removePublic(destinationPath)
    } catch (e) {
        console.log(e)
        return null
    }
}

export async function deleteImage(fileName: string) {
    const destinationPath = path.join('public', fileName)

    try {
        await fsPromises.unlink(destinationPath)
        console.log('IMAGE_REMOVED', destinationPath)
        return true
    } catch(e) {
        console.log(e)
        return false
    }
}

function _getFileExtension(file: File): string {
    const fileNameParts = file.name.split('.')
    const fileExtension = fileNameParts.pop()?.toLowerCase() || ''

    return fileExtension
}

function _removePublic(path: string) {
    return path.replace(/^public/, '')
}
