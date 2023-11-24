'use client'

import { CategoryType } from "@/libs/definations"
import { useFormState } from "react-dom"
import { onCategoryEdit } from "../../categories.actions"
import { DisplayInput, Form, FormCreatButton, FormFooter, Input } from "@/components/admin/form/form.client"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { CategoryWithParent } from "../../categories.interface"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { appToast } from "@/libs/toasts"

const initState = {
    name: '',
    parent_category_id: '',
}

export function CategoryEditForm({ category }: { category: CategoryWithParent }) {
    const [ state, onAction ] = useFormState(onCategoryEdit, initState)
    const { back } = useRouter()

    useEffect(() => {
        if (state.message) appToast(state.message)
        if (state.back) back()
    }, [ state ])

    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Reset <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Edit Category</FormCreatButton>
            </FormFooter>
        }>
            <input name="id" type="hidden" defaultValue={category.id} />
            {
                category.parent && (
                    <>
                        <input type="hidden" name="parentId" defaultValue={category.parent.id} />
                        <DisplayInput
                            defaultValue={category.parent.name}
                        >
                            Parent Name
                        </DisplayInput>
                        <div />
                    </>
                )
            }
            <Input
                name="name"
                error={state?.name}
                defaultValue={category.name}
            >
                Name
            </Input>
            <Input
                name="description"
                error={state?.description}
                defaultValue={category.description || ''}
            >
                Description (optional)
            </Input>
        </Form>
    )
}