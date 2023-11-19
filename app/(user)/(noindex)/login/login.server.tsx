'use server'

import { redirect } from "next/navigation"
import { isLogined } from "../../user.actions"
import { LoginForm } from "./login.client"

export async function ServerLogin() {
    const is = await isLogined()
    if (is) redirect('/')

    return (
        <LoginForm />
    )
}