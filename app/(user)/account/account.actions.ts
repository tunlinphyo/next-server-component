'use server'

import { wait } from "@/libs/utils"
import { handleSignOut } from "../user.actions"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"


export async function onLogin(prevProp: any, formData: FormData) {
    await wait()

    await handleSignOut()

    revalidatePath('/')
    redirect('/')
    return { code: 'Success!' }
}
