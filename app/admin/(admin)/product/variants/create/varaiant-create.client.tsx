'use client'

import { useFormState } from "react-dom"
import { onVariantCreate } from "../variant.action"
import { DisplayInput, Form, FormCreatButton, FormFooter, Input } from "@/components/admin/form/form.client"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { VariantWithParent } from "../variant.interface"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { appToast } from "@/libs/toasts"

const initState = {
    name: '',
    description: '',
    parent_varant_id: ''
}

export function VariantCreateForm({ parent }: { parent?: VariantWithParent }) {
    const [ state, onAction ] = useFormState(onVariantCreate, initState)
    const { back } = useRouter()

    useEffect(() => {
        if (state.back) {
            appToast('Success')
            back()
        }
    }, [ state ])

    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Clear <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Create Variant</FormCreatButton>
            </FormFooter>
        }>
            {
                parent && <>
                    <input type="hidden" name="parentId" defaultValue={parent.id} />
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
