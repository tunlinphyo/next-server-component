'use server'

import { CategoryType } from "@/libs/definations"
import { CategorySchema, CreateCategorySchema } from "./categories.schema"
import { getZodErrors, wait } from "@/libs/utils"
import { DELETE, GET, GET_ONE, PATCH, POST } from "@/libs/db"
import { revalidatePath } from "next/cache"
import { RedirectType, redirect } from "next/navigation"
import { PER_PAGE } from "@/libs/const"
import { Prisma } from "@prisma/client"
import prisma from "@/libs/prisma"
import { CategoryCount, CategoryWithParent, CategoryWithParentAndChildCount } from "./categories.interface"

export async function getCategoryPageLength(id?: number) {
    let query: Prisma.CategoryAggregateArgs

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
    const result = await prisma.category.aggregate(query) as CategoryCount

    return Math.ceil(result._count.id / PER_PAGE)
}

export async function getCategories(id: number | null, page: number = 1) {
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const query: Prisma.CategoryFindManyArgs = {
        where: { isDelete: false, parentId: id },
        include: {
            _count: {
                select: { children: true }
            }
        },
        skip: start,
        take: PER_PAGE,
        orderBy: { createDate: "desc" }
    }

    return await prisma.category.findMany(query) as CategoryWithParentAndChildCount[]
}

export async function getCategory(id: number) {
    return await prisma.category.findUnique({
        where: { id },
        include: {
            parent: {
                select: { id: true, name: true }
            }
        }
    }) as CategoryWithParent
}

export async function deleteCategory(id: number) {
    const getQuery: Prisma.CategoryFindUniqueArgs = {
        where: { id },
        include: {
            _count: {
                select: { children: true }
            }
        }
    }
    const category = await prisma.category.findUnique(getQuery) as CategoryWithParentAndChildCount
    if (!category) return { code: 'Category could not find' }
    if (category._count.children) return { code: 'Can not delete a category with children' }


    const delQuery: Prisma.CategoryUpdateArgs = {
        where: { id },
        data: { isDelete: true }
    }

    const delCategory = await prisma.category.update(delQuery)
    revalidatePath('/admin/product/categories')
}

export async function onCategoryCreate(prevState: any, formData: FormData) {
    await wait()

    const result = CreateCategorySchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const category = await prisma.category.create({ data: result.data })
    if (category.parentId) {
        revalidatePath(`/admin/product/categories/${category.parentId}/edit`)
        // redirect(`/admin/product/categories/${category.parentId}/edit`)
    } else {
        revalidatePath('/admin/product/categories')
        // redirect('/admin/product/categories')
    }
}

export async function onCategoryEdit(prevState: any, formData: FormData) {
    await wait()

    const result = CategorySchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const query: Prisma.CategoryUpdateArgs = {
        where: { id: result.data.id },
        data: result.data
    }

    const category = await prisma.category.update(query)
    if (category.parentId) {
        revalidatePath(`/admin/product/categories/${category.parentId}/edit`)
        // redirect(`/admin/product/categories/${category.parentId}/edit`, RedirectType.replace)
    } else {
        revalidatePath('/admin/product/categories')
        // redirect('/admin/product/categories')
    }
}

