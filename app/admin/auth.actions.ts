'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LoginSchema } from "./auth.schema"
import { User } from "@prisma/client"
import { UserType } from "@/libs/prisma/definations"
import prisma from "@/libs/prisma"
import { encryptCookieValue } from "@/auth"
import { ONE_DAY } from "@/libs/const"
const bcrypt = require('bcrypt')

export async function handleSignIn(prevState: any, formData: FormData) {
    const result = LoginSchema.safeParse( Object.fromEntries(formData))

    if (!result.success) {
        return { message: 'Invalid credentials' }
    }
    console.log('USER_DATA', result.data)

    const user:User | null = await prisma.user.findUnique({ where: { email: result.data.email } })

    if (!user) return { message: 'Invalid email' }
    if (!user.isAdmin) return { message: 'Unauth user' }
    const passwordsMatch = await bcrypt.compare(result.data.password, user.password);
    if (!passwordsMatch) return { message: 'Invalid passowrd' }

    const currentDate = new Date()
    const newDate = new Date(currentDate.getTime() + ONE_DAY)

    const cookieUser: UserType = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isDelete: user.isDelete,
        expiredAt: newDate,
    }

    const hashedValue = encryptCookieValue(JSON.stringify(cookieUser))

    const cookieStore = cookies()
    cookieStore.set('admin', hashedValue)
    redirect('/admin')
}

export async function handleSignOut() {
    const cookieStore = cookies()
    cookieStore.delete('admin')
    redirect('/admin/login')
}