import { NextRequest, NextResponse } from "next/server"
import { saveImage } from "@/libs/images"
import { wait } from "@/libs/utils"

export async function POST(request: NextRequest) {
    const { cookies } = request
    const adminCookie = cookies.get('admin')
    const isAdminLogined = !!adminCookie?.value

    if (!isAdminLogined)
        return NextResponse.json({ success: false, message: 'Invalid attempt' }, { status: 401 })

    await wait()
    try {
        const formData = await request.formData()

        const file = formData.get('file') as File
        const imagePath = await saveImage(file)

        return NextResponse.json({ success: true, data: imagePath })
    } catch(error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

