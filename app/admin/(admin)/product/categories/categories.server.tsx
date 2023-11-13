'use server'

import { getChildCategories, getParentCategories } from "./categories.actions"
import { CategoryTable } from "./categories.client"

export async function CategoryList({ page }: { page: number }) {
    const categories = await getParentCategories(page)
    return (
        <CategoryTable categories={categories} />
    )
}

export async function ChildCategoryList({ page, id }: { page: number, id: number }) {
    const categories = await getChildCategories(id, page)
    return (
        <CategoryTable categories={categories} child={true} />
    )
}
