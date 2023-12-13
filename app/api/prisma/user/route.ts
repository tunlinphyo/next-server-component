import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
const bcrypt = require('bcrypt')
const users = [
    {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin@2023',
        isAdmin: true,
    }
]

export async function GET(request: NextRequest) {
    try {
        const prisma = new PrismaClient()

        const tResult = await prisma.$transaction(async (prisma) => {
            const hashedUsers = []
            for await (const user of users) {
                const hashedPassword = await bcrypt.hash(user.password, 10)
                hashedUsers.push({
                    ...user,
                    password: hashedPassword
                })
            }
            const userResult = await prisma.user.createMany({
                data: hashedUsers
            })

            return {
                userResult,
            }
        })



        await prisma.$disconnect()

        return NextResponse.json({ success: true, data: tResult })
    } catch(error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

