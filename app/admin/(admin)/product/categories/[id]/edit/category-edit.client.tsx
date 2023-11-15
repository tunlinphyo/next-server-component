'use client'

import { CategoryType } from "@/libs/definations"
import { useFormState } from "react-dom"
import { onCategoryEdit } from "../../categories.actions"
import { DisplayInput, Form, FormCreatButton, FormFooter, Input } from "@/components/admin/form/form.client"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"

const initState = {
    name: '',
    parent_category_id: '',
}

export function CategoryEditForm({ category }: { category: CategoryType }) {
    const [ state, onAction ] = useFormState(onCategoryEdit, initState)
    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Reset <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Edit Category</FormCreatButton>
            </FormFooter>
        }>
            <input name="id" type="hidden" defaultValue={category.id} />
            <Input
                name="name"
                error={state?.name}
                defaultValue={category.name}
            >
                Name
            </Input>
            {
                category.parent_category && (
                    <DisplayInput
                        defaultValue={category.parent_category.name}
                    >
                        Parent Name
                    </DisplayInput>
                )
            }
        </Form>
    )
}