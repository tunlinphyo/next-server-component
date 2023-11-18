'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { LoginSchema } from "./auth.schema"
import { GET_ONE } from "@/libs/db"
import { UserType } from "@/libs/definations"
import { wait } from "@/libs/utils"


export async function handleSignIn(prevState: any, formData: FormData) {
    await wait()
    const result = LoginSchema.safeParse( Object.fromEntries(formData))

    if (!result.success) {
        return { message: 'Invalid credentials' }
    }
    console.log('USER_DATA', result.data)

    const user = await GET_ONE<UserType>('users', { email: result.data.email, isDelete: false })
    if (!user) return { message: 'Invalid email' }
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