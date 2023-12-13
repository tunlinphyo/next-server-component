import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const prisma = new PrismaClient()

        const status = await prisma.status.findMany()
        const orderStatus = await prisma.orderStatus.findMany()
        const user = await prisma.user.findMany()
        const category = await prisma.category.findMany()
        const variants = await prisma.variant.findMany()
        const products = await prisma.product.findMany()

        await prisma.$disconnect()

        return NextResponse.json({ success: true, data: {
            status,
            orderStatus,
            user,
            category,
            variants,
            products
        } })
    } catch(error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

