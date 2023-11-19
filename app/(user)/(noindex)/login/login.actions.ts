'use server'

import { wait } from "@/libs/utils"
import { LoginSchema } from "./login.schema"
import { GET_ONE } from "@/libs/db"
import { UserType } from "@/libs/definations"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { handleSignIn } from "../../user.actions"

export async function onLogin(prevProp: any, formData: FormData) {
    await wait()

    const result = LoginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return { message: 'Invalid credentials' }
    }

    const user = await GET_ONE<UserType>('users', { email: result.data.email, isDelete: false })
    if (!user) return { message: 'Invalid email' }
    if (user.password !== result.data.password) return { message: 'Invalid passowrd' }
    console.log('USER', user)

    const redirectUrl = String(formData.get('callback_url'))

    await handleSignIn(user)

    if (redirectUrl) {
        revalidatePath(redirectUrl)
        redirect(redirectUrl)
    } else {
        redirect('/')
    }
}

