'use client'

import { Form, FormFooter, Input, FormCreatButton, FormSkeleton } from '@/components/user/form/form.client'
import styles from './login.module.css'
import { useFormState } from 'react-dom'
import { onLogin } from './login.actions'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { appToast } from '@/libs/toasts'
import clsx from 'clsx'

const initState = {
    email: '',
    password: '',
    confirm: '',
    message: '',
}

export function LoginForm() {
    const searchParams = useSearchParams()
    const [ state, onAction ] = useFormState(onLogin, initState)
    const params = new URLSearchParams(searchParams)
    const callbackUrl = params.get('callback_url')

    useEffect(() => {
        if (state.message) appToast(state.message)
    }, [ state ])

    return (
        <div className={styles.formContainer}>
            <Form action={onAction} footer={
                <FormFooter>
                    <FormCreatButton icon={<ArrowRightOnRectangleIcon />}>
                        Login
                    </FormCreatButton>
                </FormFooter>
            }>
                <input type="hidden" name="callback_url" defaultValue={callbackUrl || ''} />
                <Input
                    name="email"
                    defaultValue='user@gmail.com'
                >
                    Email
                </Input>
                <Input
                    type="password"
                    name="password"
                    defaultValue='password'
                >
                    Password
                </Input>
            </Form>
        </div>
    )
}

export function LoginSkeleton() {
    return (
        <div className={clsx(styles.formContainer, "skeleton")}>
            <FormSkeleton count={2} />
        </div>
    )
}