'use client'

import { Payment } from "@prisma/client"
import { useFormState } from "react-dom"
import { onPaymentEdit } from "../../payments.actions"
import { Form, FormCreatButton, FormFooter, Input, Toggle } from "@/components/admin/form/form.client"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { AvatarUpload } from "@/components/admin/form/files/files.client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { appToast } from "@/libs/toasts"

export function PaymentEditForm({ payment }: { payment: Payment }) {
    const [ state, onAction ] = useFormState(onPaymentEdit, { message: '' })
    const router = useRouter()

    useEffect(() => {
        if (state.message) appToast(state.message)
        if (state.back) router.back()
    }, [ state ])

    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Reset <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Edit Payment</FormCreatButton>
            </FormFooter>
        }>
            <input type="hidden" name="id" defaultValue={payment.id} />
            <Input
                name="name"
                error={state?.name}
                defaultValue={payment.name}
            >Name</Input>
            <Toggle
                name="isDisabled"
                message="Enable Payment Method"
                error={state?.order}
                defaultValue={!payment.isDisabled}
            >Enable/Disabled</Toggle>
            <AvatarUpload
                name="logo"
                defaultValue={String(payment.logo || '')}
            >
                Logo (optional)
            </AvatarUpload>
            <AvatarUpload
                name="image"
                defaultValue={String(payment.image || '')}
            >
                Image (optional)
            </AvatarUpload>
        </Form>
    )
}