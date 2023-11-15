import { NextRequest, NextResponse } from "next/server"
import { deleteImage, saveImage } from "@/libs/images"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const result = await deleteImage(body.image)

        if (!result) throw new Error("Image could not delete")

        return NextResponse.json({ success: true, data: true })
    } catch(error: any) {
        return NextResponse.json({ success: false, message: error.message })
    }
}