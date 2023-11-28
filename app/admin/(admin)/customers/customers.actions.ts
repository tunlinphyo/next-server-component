'use server'

import { getZodErrors } from "@/libs/utils"
import { CreateCustomerSchema, EditCustomerSchema } from "./customers.schema"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PASSWORD, PER_PAGE } from "@/libs/const"
import { deleteImage } from "@/libs/images"
import { Prisma, Status } from "@prisma/client"
import prisma from "@/libs/prisma"
import { CustomerWithStatus } from "./customers.interface"
const bcrypt = require('bcrypt')

export async function getTotalCustomer() {
    const query: Prisma.CustomerCountArgs = {
        where: { isDelete: false },
    }
    return await prisma.customer.count(query)
}

export async function getCustomersPageLength(key: string) {
    const query: Prisma.CustomerCountArgs = {
        where: {
            AND: [
                { isDelete: false },
                {
                    OR: [
                        {
                            name: {
                                startsWith: key ? `%${key}%` : '',
                                mode: 'insensitive',
                            }
                        },
                        {
                            email: {
                                startsWith: key ? `%${key}%` : '',
                                mode: 'insensitive',
                            }
                        }
                    ]
                }
            ],
        },
    }

    const count = await prisma.customer.count(query)
    return Math.ceil(count / PER_PAGE)
}

export async function getCustomers(page: number = 1, key: string) {
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const query: Prisma.CustomerFindManyArgs = {
        where: {
            AND: [
                { isDelete: false },
                {
                    OR: [
                        {
                            name: {
                                startsWith: key ? `%${key}%` : '',
                                mode: 'insensitive',
                            }
                        },
                        {
                            email: {
                                startsWith: key ? `%${key}%` : '',
                                mode: 'insensitive',
                            }
                        }
                    ]
                }
            ],
        },
        include: {
            status: true 
        },
        skip: start,
        take: PER_PAGE,
        orderBy: { createDate: "desc" }
    }

    return await prisma.customer.findMany(query) as CustomerWithStatus[]
}

export async function getCustomer(id: number) {
    const customer = await prisma.customer.findUnique({ where: { id, isDelete: false } })
    if (!customer) return
    customer.password = PASSWORD
    return customer
}

export async function getStatus() {
    return await prisma.status.findMany()
}

export async function deleteCustomer(id: number, back: boolean = false) {
    try {
        await prisma.customer.update({
            where: { id },
            data: { isDelete: true }
        })
    } catch(e) {
        console.log('CAN REDIRECT ON SELF PAGE', e)
    }
    revalidatePath('/admin/customers')
    return { code: 'Customer deleted', back: true }
}

export async function onCustomerCreate(prevState: any, formData: FormData): Promise<Record<string, any>> {
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
            status: {
                connect: {
                    id: result.data.status
                }
            },
            password: hashedPassword,
        }
        const customer = await prisma.customer.create({
            data: bodyData
        })
        console.log('CUSTOMER_CREATED', customer)
    } catch (error: any) {
        console.log(error)
        return { message: error.message }
    }
    revalidatePath('/admin/customers')
    return { back: true, message: 'Success' }
}

export async function onCustomerEdit(prevState: any, formData: FormData): Promise<Record<string, any>> {
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
            email: result.data.email,
            status: {
                connect: {
                    id: result.data.status
                }
            },
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
    return { back: true, message: 'Success' }
}