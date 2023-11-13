'use server'

import { redirect } from "next/navigation"
import { FormDates } from "@/components/admin/form/form.client"
import { getCategory } from "../../categories.actions"
import { CategoryEditForm } from "./category-edit.client"

export async function CategoryEdit({ id }: { id: number }) {
    const category = await getCategory(id)
    if (!category) redirect('/admin/customers')
    return (
        <>
            <CategoryEditForm category={category} />
            <FormDates createDate={category.createDate} updateDate={category.updateDate} />
        </>
    )
}