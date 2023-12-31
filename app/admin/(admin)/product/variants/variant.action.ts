"use server"

import { PER_PAGE } from "@/libs/const"
import { getZodErrors } from "@/libs/utils"
import { CreateVariantSchema, VariantSchema } from "./variant.schema"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { VariantWithChildCount, VariantWithParent, VariantWithParentAndChildCount } from "./variant.interface"
import prisma from "@/libs/prisma"

export async function getVariantPageLength(id?: number) {
    const query: Prisma.VariantCountArgs = {
        where: {
            isDelete: false,
            parentId: id ?? null
        }
    }
    const result = await prisma.variant.count(query)

    return Math.ceil(result / PER_PAGE)
}

export async function getVariants(id: number | null, page: number = 1) {
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const query: Prisma.VariantFindManyArgs = {
        where: { isDelete: false, parentId: id },
        include: {
            _count: {
                select: { children: true }
            },
        },
        skip: start,
        take: PER_PAGE,
        orderBy: { createDate: "desc" }
    }

    return await prisma.variant.findMany(query) as VariantWithParentAndChildCount[]
}

export async function getVariant(id: number) {
    return await prisma.variant.findUnique({
        where: { id },
        include: {
            parent: {
                select: { id: true, name: true }
            }
        }
    }) as VariantWithParent
}

export async function deleteVariant(id: number, pathname: string) {
    const getQuery: Prisma.VariantFindUniqueArgs = {
        where: { id },
        include: {
            _count: {
                select: { children: true }
            },
        }
    }
    const variant = await prisma.variant.findUnique(getQuery) as VariantWithChildCount
    if (!variant) return { code: 'Variant could not find' }
    if (variant._count.children) return { code: 'Can not delete a variant with children' }

    const delQuery: Prisma.VariantUpdateArgs = {
        where: { id },
        data: { isDelete: true }
    }

    const delVariant = await prisma.variant.update(delQuery)
    revalidatePath(pathname)
    // redirect(pathname)
}

export async function onVariantCreate(prevState: any, formData: FormData): Promise<Record<string, any>> {
    const result = CreateVariantSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const query: Prisma.VariantCreateArgs = {
        data: result.data
    }

    const variant = await prisma.variant.create(query)
    if (variant.parentId) {
        revalidatePath(`/admin/product/variants/${variant.parentId}/edit`)
    } else {
        revalidatePath('/admin/product/variants')
    }
    return { back: true }
}

export async function onVariantEdit(prevState: any, formData: FormData): Promise<Record<string, any>> {
    const result = VariantSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const query: Prisma.VariantUpdateArgs = {
        where: { id: result.data.id },
        data: result.data
    }

    const variant = await prisma.variant.update(query)
    if (variant.parentId) {
        revalidatePath(`/admin/product/variants/${variant.parentId}/edit`)
    } else {
        revalidatePath('/admin/product/variants')
    }
    return { back: true }
}