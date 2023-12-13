import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { status, orderStatus } from "./data"

export async function GET(request: NextRequest) {
    try {
        const prisma = new PrismaClient()

        const tResult = await prisma.$transaction(async (prisma) => {
            const statusResult = await prisma.status.createMany({
                data: status
            })

            const orderStatusResult = await prisma.orderStatus.createMany({
                data: orderStatus
            })

            return {
                statusResult,
                orderStatusResult,
            }
        })


        await prisma.$disconnect()

        return NextResponse.json({ success: true, data: tResult })
    } catch(error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

