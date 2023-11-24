'use server'

import { CategorySchema, CreateCategorySchema } from "./categories.schema"
import { getZodErrors, wait } from "@/libs/utils"
import { revalidatePath } from "next/cache"
import { PER_PAGE } from "@/libs/const"
import { Prisma } from "@prisma/client"
import prisma from "@/libs/prisma"
import { CategoryWithParent, CategoryWithParentAndChildCount } from "./categories.interface"

export async function getCategoryPageLength(id?: number) {
    const query: Prisma.CategoryCountArgs = {
        where: {
            isDelete: false,
            parentId: id ?? null
        }
    }
    const count = await prisma.category.count(query)

    return Math.ceil(count / PER_PAGE)
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

export async function onCategoryCreate(prevState: any, formData: FormData): Promise<Record<string, any>> {
    const result = CreateCategorySchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const category = await prisma.category.create({ data: result.data })
    if (category.parentId) {
        revalidatePath(`/admin/product/categories/${category.parentId}/edit`)
    } else {
        revalidatePath('/admin/product/categories')
    }
    return { back: true, message: 'Success' }
}

export async function onCategoryEdit(prevState: any, formData: FormData): Promise<Record<string, any>> {
    const result = CategorySchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const query: Prisma.CategoryUpdateArgs = {
        where: { id: result.data.id },
        data: result.data
    }

    const category = await prisma.category.update(query)
    console.log('CATEGORY_EDIT____________', category)
    if (category.parentId) {
        revalidatePath(`/admin/product/categories/${category.parentId}/edit`)
    } else {
        revalidatePath('/admin/product/categories')
    }
    return { back: true, message: 'Success' }
}

