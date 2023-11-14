import { NextRequest, NextResponse } from "next/server"
import { saveImage } from "@/libs/images"

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

