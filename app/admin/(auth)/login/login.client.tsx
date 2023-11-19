'use client'

import { useFormState } from "react-dom";
import { handleSignIn } from "@/app/admin/auth.actions";
import { Form, FormCreatButton, FormFooter, Input } from "@/components/admin/form/form.client";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

const initState = {
    message: ''
}

export function LoginForm() {
    const [ code, onAction ] = useFormState(handleSignIn, initState)

    return (
        <Form action={onAction} footer={
            <FormFooter center={true}>
                {/* <button type="submit" className="primary">Login</button> */}
                <FormCreatButton icon={<ArrowLeftOnRectangleIcon />} full={true}>
                    Login
                </FormCreatButton>
            </FormFooter>
        }>
            <small className="error-message">
                { code && code.message }
            </small>
            <Input name="email" defaultValue="admin@gmail.com">Name</Input>
            <Input type="password" name="password" defaultValue="1234567">Passowrd</Input>
        </Form>
    )
}