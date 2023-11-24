'use client'

import { Form, FormCreatButton, FormFooter, Input } from "@/components/admin/form/form.client"
import { useFormState, useFormStatus } from "react-dom"
import { onCustomerEdit } from "../../customers.actions"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { AvatarUpload } from "@/components/admin/form/files/files.client"
import { Customer } from "@prisma/client"

const initState = {
    name: '',
    email: '',
    password: '',
    confirm: ''
}

export function CustomerEditForm({ customer }: { customer: Customer }) {
    const [ state, onAction ] = useFormState(onCustomerEdit, initState)
    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Reset <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Edit Customer</FormCreatButton>
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
            <Input
                type="password"
                name="password"
                error={state?.password}
                defaultValue={customer.password}
            >
                Password
            </Input>
            <Input
                type="password"
                name="confirm"
                error={state?.confirm}
                defaultValue={customer.password}
            >
                Confirm Password
            </Input>
            <AvatarUpload
                name="avatar"
                defaultValue={customer.avatar}
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