'use client'

import { Form, FormCreatButton, FormFooter, Input, Select } from "@/components/admin/form/form.client"
import { useFormState } from "react-dom"
import { onCustomerEdit } from "../../customers.actions"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { AvatarUpload } from "@/components/admin/form/files/files.client"
import { Customer, Status } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { appToast } from "@/libs/toasts"

const initState = {
    name: '',
    email: '',
    password: '',
    confirm: ''
}

export function CustomerEditForm({ customer, status }: { customer: Customer; status: Status[] }) {
    const [ state, onAction ] = useFormState(onCustomerEdit, initState)
    const { back } = useRouter()

    useEffect(() => {
        if (state.message) appToast(state.message)
        if (state.back) back()
    }, [ state ])

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
            <Select
                name="status"
                list={status}
                defaultValue={String(customer.statusId)}
            >Status</Select>
            <AvatarUpload
                name="avatar"
                defaultValue={customer.avatar}
            >
                Avatar (optional)
            </AvatarUpload>
        </Form>
    )
}