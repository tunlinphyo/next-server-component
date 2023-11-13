'use server'

import { getZodErrors, wait } from "@/libs/utils"
import { CreateCustomerSchema, CustomerSchema } from "./customers.schema"
import { CustomerType, GenericObject } from "@/libs/definations"
import { DELETE, GET, GET_ONE, PATCH, POST } from "@/libs/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const PER_PAGE = 5

export async function getCustomersPageLength() {
    await wait()

    const customers = await GET<CustomerType>('customers', { isDelete: false })
    return Math.ceil(customers.length / PER_PAGE)
}

export async function getCustomers(page: number = 1) {
    await wait()

    const customers = await GET<CustomerType>('customers', { isDelete: false })
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const end = start + PER_PAGE
    const sortedCustomers = customers.sort((a, b) => {
        if (a.createDate < b.createDate) return 1
        if (a.createDate > b.createDate) return -1
        return 0
    })
    return sortedCustomers.slice(start, end)
}

export async function getCustomer(id: number) {
    await wait()

    return await GET_ONE<CustomerType>('customers', { id, isDelete: false })
}

export async function deleteCustomer(id: number) {
    await wait()

    try {
        await DELETE<CustomerType>('customers', id)
        revalidatePath('/admin/customers')
        redirect('/admin/customers')
        return { code: 'Success' }
    } catch(e) {
        console.log('CAN REDIRECT ON SELF PAGE', e)
    }
}

export async function onCustomerCreate(prevState: any, formData: FormData) {
    await wait()

    const result = CreateCustomerSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const isName = await GET_ONE<CustomerType>('customers', { name: result.data.name, isDelete: false })
    const isEmail = await GET_ONE<CustomerType>('customers', { email: result.data.email, isDelete: false })
    if (isEmail || isName) {
        const errors: GenericObject = {}
        if (isEmail) errors.email = 'Customer email is already in used'
        if (isName) errors.name = 'Customer name is already in used'
        return errors
    }

    const newCustomer: CustomerType = {
        id: Date.now(),
        ...result.data,
        createDate: new Date(),
        isDelete: false
    }

    await POST<CustomerType>('customers', newCustomer)
    revalidatePath('/admin/customers')
    redirect('/admin/customers')
}

export async function onCustomerEdit(prevState: any, formData: FormData) {
    await wait()

    console.log('FORM_DATA', Object.fromEntries(formData))

    const result = CustomerSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }
    const id = result.data.id

    console.log('RESULT', result)

    const isName = await GET_ONE<CustomerType>('customers', { name: result.data.name, isDelete: false })
    const isEmail = await GET_ONE<CustomerType>('customers', { email: result.data.email, isDelete: false })
    console.log(isEmail, isName, id)
    if ((isEmail && isEmail.id !== id) || (isName && isName.id !== id)) {
        const errors: GenericObject = {}
        if (isEmail && isEmail.id !== id) errors.email = 'Customer email is already in used'
        if (isName && isName.id !== id) errors.name = 'Customer name is already in used'
        return errors
    }

    const editedCustomer = {
        ...result.data,
        updateDate: new Date(),
    } as CustomerType

    const updatedCustomer = await PATCH<CustomerType>('customers', editedCustomer)
    console.log('UPDATED', updatedCustomer)
    revalidatePath('/admin/customers')
    redirect('/admin/customers')
}