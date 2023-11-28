import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { categories, customers, users, variants } from "./data"
const bcrypt = require('bcrypt')

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

            const hashCustomer = []
            for await (const customer of customers) {
                const hashedPassword = await bcrypt.hash(customer.password, 10)
                hashCustomer.push({
                    ...customer,
                    password: hashedPassword
                })
            }
            const customerResult = await prisma.customer.createMany({
                data: hashCustomer
            })

            const variantResult = await prisma.variant.createMany({
                data: variants
            })

            const categoryResult = await prisma.category.createMany({
                data: categories
            })

            return {
                userResult,
                customerResult,
                variantResult,
                categoryResult,
            }
        })



        await prisma.$disconnect()

        return NextResponse.json({ success: true, data: tResult })
    } catch(error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

