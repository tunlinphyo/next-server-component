"use server"

import { PER_PAGE } from "@/libs/const"
import { getZodErrors } from "@/libs/utils"
import { CreateVariantSchema, VariantSchema } from "./variant.schema"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createDBVariant, getDBVariants, getDBVariant, updateDBVariant, getDBVariantsBy } from "@/libs/prisma/variant"
import { Prisma } from "@prisma/client"
import { VariantInterface } from "@/libs/prisma/definations"

export async function getVariantPageLength(id?: number) {
    let query: Prisma.VariantAggregateArgs

    if (id) {
        query = {
            _count: { id: true },
            where: { isDelete: false, parentId: id }
        }
    } else {
        query = {
            _count: { id: true },
            where: { isDelete: false, parentId: null }
        }
    }
    const result = await getDBVariantsBy(query) as { _count: { id: number } }

    console.log("COUNT", result)

    return Math.ceil(result._count.id / PER_PAGE)
}

export async function getPariantVariants(page: number = 1) {
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const query: Prisma.VariantFindManyArgs = {
        where: { isDelete: false, parentId: null },
        include: {
            parent: true,
            children: true
        },
        skip: start,
        take: PER_PAGE,
        orderBy: { createDate: "asc" }
    }
    
    return await getDBVariants(query)
}

export async function getChildVariants(id: number, page: number = 1) {
    const query: Prisma.VariantFindManyArgs = {
        where: { isDelete: false, parentId: id },
        include: {
            parent: true,
            children: true
        },
        // skip: start,
        // take: PER_PAGE,
        orderBy: { createDate: "asc" }
    }

    return await getDBVariants(query)
}

export async function getVariant(id: number) {
    return await getDBVariant({ 
        where: { id },
        include: {
            parent: true
        }
    }) as VariantInterface
}

export async function deleteVariant(id: number, pathname: string) {
    const getQuery: Prisma.VariantFindUniqueArgs = {
        where: { id },
        include: {
            children: true
        }
    }
    const variant = await getDBVariant(getQuery) as VariantInterface
    if (!variant) return { code: 'Variant could not find' }
    if (variant.children?.length) return { code: 'Can not delete a variant with children' }

    const delQuery: Prisma.VariantUpdateArgs = {
        where: { id },
        data: { isDelete: true }
    }

    const delVariant = await updateDBVariant(delQuery)
    revalidatePath(pathname)
    redirect(pathname)
}

export async function onVariantCreate(prevState: any, formData: FormData) {
    const result = CreateVariantSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const query: Prisma.VariantCreateArgs = {
        data: result.data
    }

    const variant = await createDBVariant(query)
    if (variant.parentId) {
        revalidatePath(`/admin/product/variants/${variant.parentId}/edit`)
        redirect(`/admin/product/variants/${variant.parentId}/edit`)
    } else {
        revalidatePath('/admin/product/variants')
        redirect(`/admin/product/variants/${variant.id}/edit`)
    }
}

export async function onVariantEdit(prevState: any, formData: FormData) {
    const result = VariantSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const query: Prisma.VariantUpdateArgs = {
        where: { id: result.data.id },
        data: result.data
    }

    const variant = await updateDBVariant(query)
    if (variant.parentId) {
        revalidatePath(`/admin/product/variants/${variant.parentId}/edit`)
        redirect(`/admin/product/variants/${variant.parentId}/edit`)
    } else {
        revalidatePath('/admin/product/variants')
        redirect('/admin/product/variants')
    }
}