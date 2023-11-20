'use client'

// import { VariantType } from "@/libs/definations"
import { useFormState } from "react-dom"
import { onVariantEdit } from "../../variant.action"
import { DisplayInput, Form, FormCreatButton, FormFooter, Input } from "@/components/admin/form/form.client"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { VariantWithParent } from "../../variant.interface"


const initState = {
  name: '',
  description: '',
  parent_category_id: '',
}

export function VariantEditForm({ variant }: { variant: VariantWithParent }) {
    const [ state, onAction ] = useFormState(onVariantEdit, initState)
    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Reset <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Edit Variant</FormCreatButton>
            </FormFooter>
        }>
            <input type="hidden" name="id" defaultValue={variant.id} />
            {
                variant.parentId && <>
                    <DisplayInput defaultValue={variant.parent?.name as string}>
                        Parent Name
                    </DisplayInput>
                    <div />
                </>
            }
            <Input
                name="name"
                error={state?.name}
                defaultValue={variant.name}
            >
                Name
            </Input>
            <Input
                name="description"
                error={state?.description}
                defaultValue={variant.description as string}
            >
                Description (optional)
            </Input>
        </Form>
    )
}
