'use server'

import { getZodErrors } from "@/libs/utils"
import { CreateCustomerSchema, EditCustomerSchema } from "./customers.schema"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PASSWORD, PER_PAGE } from "@/libs/const"
import { deleteImage } from "@/libs/images"
import { Customer, Prisma } from "@prisma/client"
import prisma from "@/libs/prisma"
const bcrypt = require('bcrypt')

export async function getTotalCustomer() {
    const query: Prisma.CustomerCountArgs = {
        where: { isDelete: false },
    }
    return await prisma.customer.count(query)
}

export async function getCustomersPageLength() {
    const query: Prisma.CustomerCountArgs = {
        where: { isDelete: false },
    }

    const count = await prisma.customer.count(query)
    return Math.ceil(count / PER_PAGE)
}

export async function getCustomers(page: number = 1) {
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const query: Prisma.CustomerFindManyArgs = {
        where: { isDelete: false },
        skip: start,
        take: PER_PAGE,
        orderBy: { createDate: "desc" }
    }

    return await prisma.customer.findMany(query)
}

export async function getCustomer(id: number) {
    const customer = await prisma.customer.findUnique({ where: { id, isDelete: false } })
    if (!customer) return
    customer.password = PASSWORD
    return customer
}

export async function deleteCustomer(id: number) {
    try {
        await prisma.customer.update({
            where: { id },
            data: { isDelete: true }
        })
    } catch(e) {
        console.log('CAN REDIRECT ON SELF PAGE', e)
    }
    revalidatePath('/admin/customers')
    redirect('/admin/customers')
}

export async function onCustomerCreate(prevState: any, formData: FormData): Promise<Record<string, string>> {
    const result = CreateCustomerSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const imagesToDelete = formData.getAll('delete_images') as string[]
    for await (const img of imagesToDelete) {
        await deleteImage(img)
    }

    try {
        const hashedPassword = await bcrypt.hash(result.data.password, 10)
        const bodyData: Prisma.CustomerCreateInput = {
            avatar: result.data.avatar,
            name: result.data.name,
            email: result.data.email,
            password: hashedPassword
        }
        const customer = await prisma.customer.create({
            data: bodyData
        })
        console.log('CUSTOMER_UPDATED', customer)
    } catch (error: any) {
        console.log(error)
        return { message: error.message }
    }
    revalidatePath('/admin/customers')
    redirect('/admin/customers')
}

export async function onCustomerEdit(prevState: any, formData: FormData): Promise<Record<string, string>> {
    const result = EditCustomerSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }
    const id = result.data.id

    const imagesToDelete = formData.getAll('delete_images') as string[]
    for await (const img of imagesToDelete) {
        await deleteImage(img)
    }

    try {
        const bodyData: Prisma.CustomerUpdateInput = {
            avatar: result.data.avatar,
            name: result.data.name,
            email: result.data.email
        }
        if (result.data.password !== PASSWORD) {
            const hashedPassword = await bcrypt.hash(result.data.password, 10)
            bodyData.password = hashedPassword
        }
        const customer = await prisma.customer.update({
            where: { id: result.data.id },
            data: bodyData
        })
        console.log('CUSTOMER_UPDATED', customer)
    } catch (error: any) {
        console.log(error)
        return { message: error.message }
    }
    revalidatePath('/admin/customers')
    redirect('/admin/customers')
}