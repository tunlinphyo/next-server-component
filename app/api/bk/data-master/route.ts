import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { categories, status, variants } from "./data"

export async function GET(request: NextRequest) {
    try {
        const prisma = new PrismaClient()
        
        const tResult = await prisma.$transaction(async (prisma) => {
            const statusResult = await prisma.status.createMany({
                data: status
            })

            const categoryResult = await prisma.category.createMany({
                data: categories
            })

            const variantResult = await prisma.variant.createMany({
                data: variants
            })
            
            return {
                statusResult,
                categoryResult,
                variantResult,
            }
        })


        await prisma.$disconnect()

        return NextResponse.json({ success: true, data: tResult })
    } catch(error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

