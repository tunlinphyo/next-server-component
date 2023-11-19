'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LoginSchema } from "./auth.schema"
import { wait } from "@/libs/utils"
import { getDBUser } from "@/libs/prisma/user"
import { User } from "@prisma/client"


export async function handleSignIn(prevState: any, formData: FormData) {
    await wait()
    const result = LoginSchema.safeParse( Object.fromEntries(formData))

    if (!result.success) {
        return { message: 'Invalid credentials' }
    }
    console.log('USER_DATA', result.data)

    const user:User | null = await getDBUser({ where: { email: result.data.email } })

    console.log("DB_USER", user)

    if (!user) return { message: 'Invalid email' }
    if (!user.isAdmin) return { message: 'Unauth user' }
    if (user.password !== result.data.password) return { message: 'Invalid passowrd' }
    console.log('USER', user)

    const cookieStore = cookies()
    cookieStore.set('admin', JSON.stringify(user), { secure: false })
    redirect('/admin')
}

export async function handleSignOut() {
    const cookieStore = cookies()
    cookieStore.delete('admin')
    redirect('/admin/login')
}