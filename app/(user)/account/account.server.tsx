'use server'

import { redirect } from "next/navigation"
import { isLogined } from "../user.actions"
import { LogoutForm } from "./account.client"

export async function ServerLogoutForm() {
    const is = await isLogined()
    if (!is) redirect('/')

    return (
        <LogoutForm />
    )
}