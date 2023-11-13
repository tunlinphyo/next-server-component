'use client'

import { Form, FormCreatButton, FormFooter, Input } from "@/components/admin/form/form.client"
import { useFormState, useFormStatus } from "react-dom"
import { onCustomerEdit } from "../../customers.actions"
import { CustomerType } from "@/libs/definations"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"

const initState = {
    name: '',
    email: ''
}

export function CustomerEditForm({ customer }: { customer: CustomerType }) {
    const [ state, onAction ] = useFormState(onCustomerEdit, initState)
    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Clear <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Create Customer</FormCreatButton>
            </FormFooter>
        }>
            <input name="id" type="hidden" defaultValue={customer.id} />
            <Input
                name="name"
                error={state?.name}
                defaultValue={customer.name}
            >
                Customer Name
            </Input>
            <Input
                type="email"
                name="email"
                error={state?.email}
                defaultValue={customer.email}
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