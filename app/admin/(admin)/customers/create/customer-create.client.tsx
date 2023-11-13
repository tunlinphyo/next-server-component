'use client'

import { Form, FormCreatButton, FormFooter, Input } from "@/components/admin/form/form.client"
import { useFormState, useFormStatus } from "react-dom"
import { onCustomerCreate } from "../customers.actions"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"

const initState = {
    name: '',
    email: ''
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
                Customer Name
            </Input>
            <Input
                type="email"
                name="email"
                error={state?.email}
            >
                Customer Email
            </Input>
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