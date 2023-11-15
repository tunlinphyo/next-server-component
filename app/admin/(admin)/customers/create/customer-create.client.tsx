'use client'

import { Form, FormCreatButton, FormFooter, Input } from "@/components/admin/form/form.client"
import { useFormState, useFormStatus } from "react-dom"
import { onCustomerCreate } from "../customers.actions"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { AvatarUpload } from "@/components/admin/form/files/files.client"

const initState = {
    name: '',
    email: '',
    password: '',
    confirm: ''
}

export function CustomerCreateForm() {
    const [ state, onAction ] = useFormState(onCustomerCreate, initState)
    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">
                    Clear
                    <ArrowPathIcon />
                </button>
                <FormCreatButton icon={<CheckCircleIcon />}>Create Customer</FormCreatButton>
            </FormFooter>
        }>
            <Input
                name="name"
                error={state?.name}
            >
                Name
            </Input>
            <Input
                type="email"
                name="email"
                error={state?.email}
            >
                Email
            </Input>
            <Input
                type="password"
                name="password"
                error={state?.password}
            >
                Password
            </Input>
            <Input
                type="password"
                name="confirm"
                error={state?.confirm}
            >
                Confirm Password
            </Input>
            <AvatarUpload
                name="avatar"
            >
                Avatar (optional)
            </AvatarUpload>
        </Form>
    )
}

export function CreateButton() {
    const { pending } = useFormStatus()
    return (
        <button className="primary" disabled={pending}>
            Create Customer
        </button>
    )
}