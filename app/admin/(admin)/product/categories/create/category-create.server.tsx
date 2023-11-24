'use server'

import { getCategory } from "../categories.actions"
import { CategoryCreateForm } from "./category-create.client"
import { CategoryWithParent } from "../categories.interface";

export async function CreateCategory({ id }: { id?: number }) {
    let category: CategoryWithParent | undefined;
    if (id) {
        category = await getCategory(id)
    }
    return (
        <CategoryCreateForm parent={category} />
    )
}