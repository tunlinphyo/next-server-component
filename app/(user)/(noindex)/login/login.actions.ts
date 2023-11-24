'use server'

import { wait } from "@/libs/utils"
import { LoginSchema } from "./login.schema"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { handleSignIn } from "../../user.actions"
import prisma from "@/libs/prisma"
const bcrypt = require('bcrypt')

export async function onLogin(prevProp: any, formData: FormData) {
    await wait()

    const result = LoginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return { message: 'Invalid credentials' }
    }

    const customer = await prisma.customer.findUnique({ where: { email: result.data.email } })
    if (!customer) return { message: 'Invalid email' }
    const passwordsMatch = await bcrypt.compare(result.data.password, customer.password);
    if (!passwordsMatch) return { message: 'Invalid passowrd' }
    console.log('USER', customer)

    const redirectUrl = String(formData.get('callback_url'))

    await handleSignIn(customer)

    if (redirectUrl) {
        revalidatePath(redirectUrl)
        redirect(redirectUrl)
    } else {
        redirect('/')
    }
}

