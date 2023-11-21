'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LoginSchema } from "./auth.schema"
import { User } from "@prisma/client"
import { UserType } from "@/libs/prisma/definations"
import prisma from "@/libs/prisma"


export async function handleSignIn(prevState: any, formData: FormData) {
    const result = LoginSchema.safeParse( Object.fromEntries(formData))

    if (!result.success) {
        return { message: 'Invalid credentials' }
    }
    console.log('USER_DATA', result.data)

    const user:User | null = await prisma.user.findUnique({ where: { email: result.data.email } })

    if (!user) return { message: 'Invalid email' }
    if (!user.isAdmin) return { message: 'Unauth user' }
    if (user.password !== result.data.password) return { message: 'Invalid passowrd' }

    const cookieUser: UserType = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isDelete: user.isDelete
    }

    const cookieStore = cookies()
    cookieStore.set('admin', JSON.stringify(cookieUser), { secure: false })
    redirect('/admin')
}

export async function handleSignOut() {
    const cookieStore = cookies()
    cookieStore.delete('admin')
    redirect('/admin/login')
}