import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { categories } from "./data"
const bcrypt = require('bcrypt')

export async function GET(request: NextRequest) {
    try {
        const prisma = new PrismaClient()
        
        const tResult = await prisma.$transaction(async (prisma) => {
            const categoryResult = await prisma.category.createMany({
                data: categories
            })

            return {
                categoryResult,
            }
        })



        await prisma.$disconnect()

        return NextResponse.json({ success: true, data: tResult })
    } catch(error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

