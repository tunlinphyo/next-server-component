import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
const bcrypt = require('bcrypt')

export async function GET(request: NextRequest) {
    try {
        const prisma = new PrismaClient()
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true
            }
        })

        // const password = "admin@2023"

        // const hashedPassword = await bcrypt.hash(password, 10);

        // const user = await prisma.user.create({
        //     data: {
        //       name: 'Admin',
        //       email: 'admin@gmail.com',
        //       password: hashedPassword,
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

