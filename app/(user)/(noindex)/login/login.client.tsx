'use client'

import { Form, FormFooter, Input, FormCreatButton, FormSkeleton } from '@/components/user/form/form.client'
import styles from './login.module.css'
import { useFormState } from 'react-dom'
import { onLogin } from './login.actions'
import { ArrowLeftOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import clsx from 'clsx'
import { useToast } from '@/components/user/toast/toast.index'
import Link from 'next/link'

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
    const { showToast } = useToast()

    useEffect(() => {
        if (state.message) showToast(state.message)
    }, [ state ])

    return (
        <div className={styles.formContainer}>
            <Form action={onAction} footer={
                <FormFooter>
                    <FormCreatButton icon={<ArrowLeftOnRectangleIcon />}>
                        Login
                    </FormCreatButton>
                    <Link href="/register" className="button">
                        Register
                        <UserPlusIcon />
                    </Link>
                </FormFooter>
            }>
                <input type="hidden" name="callback_url" defaultValue={callbackUrl || ''} />
                <Input
                    name="email"
                    defaultValue='customer.one@gmail.com'
                >
                    Email
                </Input>
                <Input
                    type="password"
                    name="password"
                    defaultValue='user@2023'
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