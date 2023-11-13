'use client'

import { VariantType } from "@/libs/definations"
import { useFormState } from "react-dom"
import { onVariantCreate } from "../variant.action"
import { DisplayInput, Form, FormCreatButton, FormFooter, Input } from "@/components/admin/form/form.client"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"

const initState = {
    name: '',
    description: '',
    parent_varant_id: ''
}

export function VariantCreateForm({ parent }: { parent?: VariantType }) {
    const [ state, onAction ] = useFormState(onVariantCreate, initState)
    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Clear <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Create Variant</FormCreatButton>
            </FormFooter>
        }>
            {
                parent && <>
                    <input type="hidden" name="parent_variant_id" defaultValue={parent.id} />
                    <DisplayInput defaultValue={parent.name}>
                        Parent Name
                    </DisplayInput>
                    <div />
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
