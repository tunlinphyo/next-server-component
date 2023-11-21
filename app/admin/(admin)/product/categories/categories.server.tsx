'use server'

import { getCategories } from "./categories.actions"
import { CategoryTable } from "./categories.client"

export async function CategoryList({ page }: { page: number }) {
    const categories = await getCategories(null, page)
    return (
        <CategoryTable categories={categories} />
    )
}

export async function ChildCategoryList({ page, id }: { page: number, id: number }) {
    const categories = await getCategories(id, page)
    return (
        categories.length
            ? <CategoryTable categories={categories} child={true} />
            : <></>
    )
}
