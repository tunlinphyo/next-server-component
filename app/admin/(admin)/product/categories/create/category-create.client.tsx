'use client'

import { DisplayInput, Form, FormCreatButton, FormFooter, Input } from "@/components/admin/form/form.client"
import { useFormState } from "react-dom"
import { onCategoryCreate } from "../categories.actions"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { CategoryWithParent } from "../categories.interface"

const initState = {
    name: '',
    parent_category_id: ''
}

export function CategoryCreateForm({ parent }: { parent?: CategoryWithParent }) {
    const [ state, onAction ] = useFormState(onCategoryCreate, initState)
    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Clear <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Create Category</FormCreatButton>
            </FormFooter>
        }>
            {
                parent && <>
                    <>
                    <input type="hidden" name="parentId" defaultValue={parent.id} />
                    <DisplayInput defaultValue={parent.name}>
                        Parent Name
                    </DisplayInput>
                    <div />
                    </>
                </>
            }
            <Input
                name="name"
                error={state?.name}
            >
                Name
            </Input>
            <Input
                name="description"
                error={state?.description}
            >
                Description (optional)
            </Input>
        </Form>
    )
}