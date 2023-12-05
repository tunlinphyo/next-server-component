'use client'

import { useFormState } from "react-dom"
import { onPaymentCreate } from "../payments.actions"
import { Form, FormCreatButton, FormFooter, Input, Toggle } from "@/components/admin/form/form.client"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { AvatarUpload } from "@/components/admin/form/files/files.client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { appToast } from "@/libs/toasts"

export function PaymentCreateForm() {
    const [ state, onAction ] = useFormState(onPaymentCreate, { message: '' })
    const router = useRouter()

    useEffect(() => {
        if (state.message) appToast(state.message)
        if (state.back) router.back()
    }, [ state ])

    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">
                    Clear
                    <ArrowPathIcon />
                </button>
                <FormCreatButton icon={<CheckCircleIcon />}>Create Payment</FormCreatButton>
            </FormFooter>
        }>
            <Input
                name="name"
                error={state?.name}
            >Name</Input>
            <div />
            <Toggle
                name="isDisabled"
                message="Enable Payment Method"
                defaultValue={true}
                error={state?.isDisabled}
            >Enable/Disabled</Toggle>
            <Toggle
                name="isCredit"
                message="Credit Card"
                defaultValue={false}
                error={state?.isCredit}
            >Credit Card?</Toggle>
            <AvatarUpload
                name="logo"
            >
                Logo (optional)
            </AvatarUpload>
            <AvatarUpload
                name="image"
            >
                Image (optional)
            </AvatarUpload>
        </Form>
    )
}
