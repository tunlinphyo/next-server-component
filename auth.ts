import { User } from "@prisma/client"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"

export function isAdmin(cookies: RequestCookie | undefined) {
    if (!cookies) return false
    const adminUser: Partial<User> = JSON.parse(cookies.value)
    return adminUser && adminUser.isAdmin && !adminUser.isDelete
}