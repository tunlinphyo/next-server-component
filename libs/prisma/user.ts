import { Prisma } from "@prisma/client"
import prisma from "."
import { DefaultArgs } from "@prisma/client/runtime/library"

export async function getDBUsers() {
    return await prisma.user.findMany()
}

export async function getDBUser(query: Prisma.UserFindUniqueArgs) {
    return await prisma.user.findUnique(query)
}