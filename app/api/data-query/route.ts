import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const prisma = new PrismaClient()
        const allUsers = await prisma.user.findMany()

        // const user = await prisma.user.create({
        //     data: {
        //       name: 'Admin',
        //       email: 'admin@gmail.com',
        //       password: '1234567',
        //       isDelete: false,
        //       isAdmin: true
        //     },
        // })
        // console.log(user)


        await prisma.$disconnect()

        return NextResponse.json({ success: true, data: allUsers })
    } catch(error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

