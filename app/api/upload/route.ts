
import path from "path"
import fs, { promises as fsPromises } from "fs"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        const file = formData.get('file') as File
        const imagePath = await saveImage(file)

        return NextResponse.json({ success: true, data: imagePath })
    } catch(error: any) {
        return NextResponse.json({ success: false, message: error.message })
    }
}

async function saveImage(file: File) {
    const destinationDirectory = 'public/uploads'
    const extension = getFileExtension(file)
    const fileName = `${Date.now()}.${extension}`
    const destinationPath = path.join(destinationDirectory, fileName)

    try {
        const imageBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(imageBuffer)
        fs.writeFileSync(destinationPath, buffer)
        return '/'.concat(destinationPath)
    } catch (e) {
        console.log(e)
        return null
    }
}

function getFileExtension(file: File): string {
    const fileNameParts = file.name.split('.')
    const fileExtension = fileNameParts.pop()?.toLowerCase() || ''

    return fileExtension
}

