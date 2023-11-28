import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { products } from "./data"

export async function GET(request: NextRequest) {
    try {
        const prisma = new PrismaClient()
        
        const tResult = await prisma.$transaction(async (prisma) => {
            const productResult = await prisma.product.createMany({
                data: products
            })

            return {
                productResult,
            }
        })



        await prisma.$disconnect()

        return NextResponse.json({ success: true, data: tResult })
    } catch(error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

