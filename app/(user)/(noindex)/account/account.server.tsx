'use server'

import { redirect } from "next/navigation"
import { getUser } from "../../user.actions"
import { LogoutForm } from "./account.client"
import { PageTitle } from "@/components/user/utils/utils.client"

export async function ServerLogoutForm() {
    const user = await getUser()
    if (!user) redirect('/')

    return (
        <>
            <PageTitle title={`Hi ${user.name}`} />
            <LogoutForm />
        </>
    )
}