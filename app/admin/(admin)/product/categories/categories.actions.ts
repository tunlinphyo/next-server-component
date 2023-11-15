'use server'

import { CategoryType } from "@/libs/definations"
import { CategorySchema, CreateCategorySchema } from "./categories.schema"
import { getZodErrors, wait } from "@/libs/utils"
import { DELETE, GET, GET_ONE, PATCH, POST } from "@/libs/db"
import { revalidatePath } from "next/cache"
import { RedirectType, redirect } from "next/navigation"
import { PER_PAGE } from "@/libs/const"

export async function getCategoryPageLength(id?: number) {
    await wait(50)

    const query: Partial<CategoryType> = {
        isDelete: false
    }
    if (id) {
        query.parent_category_id = id
    } else {
        query.parent_category_id = undefined
    }

    const categories = await GET<CategoryType>('product_categories', query)
    return Math.ceil(categories.length / PER_PAGE)
}

export async function getParentCategories(page: number = 1) {
    await wait()

    const categories = await GET<CategoryType>('product_categories', { parent_category_id: undefined, isDelete: false })
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const end = start + PER_PAGE
    const sortedCategories = categories.sort((a, b) => {
        if (a.createDate < b.createDate) return 1
        if (a.createDate > b.createDate) return -1
        return 0
    })
    const paginated = sortedCategories.slice(start, end)
    const result: CategoryType[] = []
    for await (const category of paginated) {
        category.child_count = await _getChildrenCategoryCount(category.id, 0)
        result.push(category)
    }
    return result
}

export async function getChildCategories(id: number, page = 1) {
    await wait()

    const categories = await GET<CategoryType>('product_categories', { parent_category_id: id, isDelete: false })
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const end = start + PER_PAGE
    const sortedCategories = categories.sort((a, b) => {
        if (a.createDate < b.createDate) return 1
        if (a.createDate > b.createDate) return -1
        return 0
    })
    const paginated = sortedCategories.slice(start, end)
    const result: CategoryType[] = []
    for await (const category of paginated) {
        const parent = await GET_ONE<CategoryType>('product_categories', { id: category.parent_category_id, isDelete: false })
        category.parent_category = parent
        category.child_count = await _getChildrenCategoryCount(category.id, 0)
        result.push(category)
    }
    return result
}

export async function getCategory(id: number) {
    await wait()

    const category = await GET_ONE<CategoryType>('product_categories', { id, isDelete: false })
    if (category && category.parent_category_id) {
        const parent = await GET_ONE<CategoryType>('product_categories', { id: category.parent_category_id, isDelete: false })
        category.parent_category = parent
    }
    return category
}

export async function deleteCategory(id: number) {
    await wait()

    const childCategories = await GET<CategoryType>('product_categories', { parent_category_id: id, isDelete: false })
    if (childCategories.length) return { code: 'Can not delete a category with children' }
    try {
        await DELETE<CategoryType>('product_categories', id)
        revalidatePath('/admin/product/categories')
        redirect('/admin/product/categories')
    } catch(e) {
        console.log('CAN REDIRECT ON SELF PAGE', e)
        return { code: '' }
    }
}

export async function onCategoryCreate(prevState: any, formData: FormData) {
    await wait()

    const result = CreateCategorySchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const isName = await GET_ONE<CategoryType>('product_categories', { name: result.data.name, isDelete: false })
    if (isName) {
        return { name: 'Category name is already in used' }
    }

    const newCategory = await POST<CategoryType>('product_categories', result.data)
    if (newCategory.parent_category_id) {
        revalidatePath(`/admin/product/categories/${newCategory.parent_category_id}/edit`)
        redirect(`/admin/product/categories/${newCategory.parent_category_id}/edit`)
    } else {
        revalidatePath('/admin/product/categories')
        redirect('/admin/product/categories')
    }
}

export async function onCategoryEdit(prevState: any, formData: FormData) {
    await wait()

    const result = CategorySchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const isName = await GET_ONE<CategoryType>('product_categories', { name: result.data.name, isDelete: false })
    if (isName && isName.id !== result.data.id) {
        return { name: 'Category name is already in used' }
    }

    const updatedCategory = await PATCH<CategoryType>('product_categories', result.data)
    console.log('UPDATED', updatedCategory)
    if (updatedCategory?.parent_category_id) {
        revalidatePath(`/admin/product/categories/${updatedCategory.parent_category_id}/edit`)
        redirect(`/admin/product/categories/${updatedCategory.parent_category_id}/edit`, RedirectType.replace)
    } else {
        revalidatePath('/admin/product/categories')
        redirect('/admin/product/categories')
    }
}

async function _getChildrenCategoryCount(id: number, count = 0) {
    const children = await GET<CategoryType>('product_categories', { parent_category_id: id, isDelete: false })
    count += children.length
    for await (const child of children) {
        count = await _getChildrenCategoryCount(child.id, count)
    }
    return count
}
