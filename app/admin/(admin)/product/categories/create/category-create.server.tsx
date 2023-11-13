'use server'

import { CategoryType } from "@/libs/definations"
import { getCategory } from "../categories.actions"
import { CategoryCreateForm } from "./category-create.client"

export async function CreateCategory({ id }: { id?: number }) {
    let category: CategoryType | undefined;
    if (id) {
        category = await getCategory(id)
    }
    return (
        <CategoryCreateForm parent={category} />
    )
}