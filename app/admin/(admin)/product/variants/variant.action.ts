"use server"

import { PER_PAGE } from "@/libs/const"
import { getZodErrors } from "@/libs/utils"
import { CreateVariantSchema, VariantSchema } from "./variant.schema"
import { revalidatePath } from "next/cache"
import { RedirectType, redirect } from "next/navigation"
import { Prisma } from "@prisma/client"
import { VariantCount, VariantWithChildCount, VariantWithParent, VariantWithParentAndChildCount } from "./variant.interface"
import prisma from "@/libs/prisma"

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
    const result = await prisma.variant.aggregate(query) as VariantCount

    return Math.ceil(result._count.id / PER_PAGE)
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

export async function onVariantCreate(prevState: any, formData: FormData) {
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
        redirect(`/admin/product/variants/${variant.parentId}/edit`, RedirectType.replace)
    } else {
        revalidatePath('/admin/product/variants')
        redirect(`/admin/product/variants/${variant.id}/edit`, RedirectType.replace)
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

    const variant = await prisma.variant.update(query)
    if (variant.parentId) {
        revalidatePath(`/admin/product/variants/${variant.parentId}/edit`)
        redirect(`/admin/product/variants/${variant.parentId}/edit`, RedirectType.replace)
    } else {
        revalidatePath('/admin/product/variants')
        redirect('/admin/product/variants', RedirectType.replace)
    }
}