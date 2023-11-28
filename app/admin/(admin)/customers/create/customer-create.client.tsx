'use client'

import { Form, FormCreatButton, FormFooter, Input, Select } from "@/components/admin/form/form.client"
import { useFormState } from "react-dom"
import { onCustomerCreate } from "../customers.actions"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { AvatarUpload } from "@/components/admin/form/files/files.client"
import { useEffect } from "react"
import { appToast } from "@/libs/toasts"
import { useRouter } from "next/navigation"
import { Status } from "@prisma/client"

const initState = {
    name: '',
    email: '',
    password: '',
    confirm: ''
}

export function CustomerCreateForm({ status }: { status: Status[] }) {
    const [ state, onAction ] = useFormState(onCustomerCreate, initState)
    const { back } = useRouter()

    useEffect(() => {
        if (state.message) appToast(state.message)
        if (state.back) back()
    }, [ state ])

    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">
                    Clear
                    <ArrowPathIcon />
                </button>
                <FormCreatButton icon={<CheckCircleIcon />}>Create Customer Test</FormCreatButton>
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
            <Select
                name="status"
                list={status}
            >Status</Select>
            <AvatarUpload
                name="avatar"
            >
                Avatar (optional)
            </AvatarUpload>
        </Form>
    )
}
