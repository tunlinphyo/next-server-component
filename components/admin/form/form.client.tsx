'use client'

import { ChildrenProp, FormArrayType } from "@/libs/definations"
import styles from './form.module.css'
import clsx from "clsx";
import { useFormState, useFormStatus } from "react-dom";
import { ArrowPathIcon, ChevronUpDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ButtonSkeleton } from "../button/button.client";
import { TextSkeleton } from "../utils/utils.client";
import { formatDate } from "@/libs/utils";
import { useEffect, useRef, useState } from "react";
import { appConfirm } from "@/libs/modals";
import { appToast } from "@/libs/toasts";

type FormProps = ChildrenProp & {
    action: (formData: FormData) => void;
    footer: React.ReactNode;
}
type InputProps = {
    children?: React.ReactNode;
    name: string;
    type?: React.HTMLInputTypeAttribute;
    defaultValue?: string;
    error?: string;
}
type SelectProps = {
    children?: React.ReactNode;
    name: string;
    list: FormArrayType[];
    defaultValue?: string;
    error?: string;
    placeholder?: string;
}
type TextareaProps = {
    children?: React.ReactNode;
    name: string;
    rows?: number;
    defaultValue?: string;
    error?: string;
}
type CheckboxsProp = {
    children?: React.ReactNode;
    name: string;
    list: FormArrayType[];
    defaultValue?: number[];
    error?: string;
}
type CheckboxProp = {
    id: number;
    name: string;
    label: string;
    checked: boolean;
}
type DisplayInputProps = ChildrenProp & {
    defaultValue: string;
}
type FormFooterProps = ChildrenProp & {
    center?: boolean;
}
type FromDeleteButtonProps = {
    children?: React.ReactNode;
    action: (prevState: any, formData: FormData) => Promise<any>;
}
type FormCreatButtonProps = ChildrenProp & {
    icon: any,
    full?: boolean;
}


export function Form({ children, action, footer }: FormProps) {
    return (
        <form action={action} className={styles.form}>
            <div className={styles.formContainer}>
                { children }
            </div>
            { footer }
        </form>
    )
}

export function Input({ children, name, type, defaultValue, error }: InputProps) {
    return (
        <div className={styles.formGroup}>
            <label htmlFor={name} className={styles.label}>{ children }</label>
            <div className={styles.inputContainer}>
                <input 
                    className={styles.input}
                    type={type || 'text'} 
                    name={name} 
                    defaultValue={defaultValue || ''} 
                />
                { error && <small>{ error }</small> }
            </div>
        </div>
    )
}

export function Textarea({ children, name, rows, defaultValue, error }: TextareaProps) {
    return (
        <div className={clsx(styles.formGroup, styles.formGroupSpan)}>
            <label htmlFor={name} className={styles.label}>{ children }</label>
            <div className={styles.inputContainer}>
                <textarea name={name} defaultValue={defaultValue || ''} rows={rows || 4} />
                { error && <small>{ error }</small> }
            </div>
        </div>
    )
}

export function Checkboxs({ children, name, list, defaultValue, error }: CheckboxsProp) {
    const checkeds = defaultValue || []
    return (
        <div className={clsx(styles.formGroup, styles.formGroupSpan)}>
            <label htmlFor={name} className={styles.label}>{ children }</label>
            <div className={styles.inputContainer}>
                <div className={styles.checkboxs}>
                    {
                        list.map(item => (
                            <Checkbox 
                                key={item.id} 
                                id={item.id} 
                                name={name} 
                                label={item.name}
                                checked={!!checkeds?.includes(item.id)}
                            />
                        ))
                    }
                </div>
                { error && <small>{ error }</small> }
            </div>
        </div>
    )
}

export function Checkbox({ id, name, label, checked }: CheckboxProp) {
    return (
        <label className={styles.checkbox}>
            <input type="checkbox" name={`${name}_${id}`} value={id} defaultChecked={checked} />
            <div className={styles.checkboxLabel}>{ label }</div>
        </label>
    )
}

export function DisplayInput({ children, defaultValue }: DisplayInputProps) {
    return (
        <div className={styles.formGroup}>
            <label >{ children }</label>
            <div className={styles.inputContainer}>
                <input type="text" readOnly={true} defaultValue={defaultValue} className={styles.input} />
            </div>
        </div>
    )
}

export function Select({ children, name, list, defaultValue, error, placeholder }: SelectProps) {
    return (
        <div className={styles.formGroup}>
            <label htmlFor={name} className={styles.label}>{ children }</label>
            <div className={styles.inputContainer}>
                <div className={styles.selectContainer}>
                    <ChevronUpDownIcon />
                    <select name={name} defaultValue={defaultValue}>
                        <option value="">{ placeholder || 'Select a value' }</option> 
                        {
                            list.map(item => (
                                <option key={item.id} value={item.id}>{ item.name }</option>
                            ))
                        }
                    </select>
                </div>
                { error && <small>{ error }</small> }
            </div>
        </div>
    )
}

export function FormFooter({ children, center }: FormFooterProps) {
    return (
        <footer className={clsx(styles.formFooter, center && styles.footerCenter)}>
            { children }
        </footer>
    )
}

export function FormCreatButton({ children, icon, full }: FormCreatButtonProps) {
    const { pending } = useFormStatus()
    return (
        <button className={clsx("primary with-loading", full && "full")} disabled={pending}>
            { children }
            { pending ? <ArrowPathIcon className="icon-loading" /> : icon }
        </button>
    )
}

export function FromDeleteButton({ children, action }: FromDeleteButtonProps) {
    const [ state, onAction ] = useFormState(action, { code: '' })
    useEffect(() => {
        if (state.code) appToast(state.code)
    }, [ state ])
    return (
        <form action={onAction}>
            <DeleteButton children={children} />
        </form>
    )
}

export function DeleteButton({ children }: { children?: React.ReactNode }) {
    const buttonEl = useRef<HTMLButtonElement | null>(null)
    const { pending } = useFormStatus()
    const [ loading, setLoading ] = useState(false)
    const isChildren = !!children
    const handleClick = async () => {
        setLoading(true)
        const result = await appConfirm('Are you sure to delete?', {
            confirmText: 'delete',
            waitAnimation: false
        })
        setLoading(false)
        if (result) {
            const form = buttonEl.current?.parentElement as HTMLFormElement
            form.requestSubmit()
        }
    }
    return (
        <button 
            type="button"
            ref={buttonEl}
            onClick={handleClick}
            className={clsx('button icon-button danger', isChildren && 'has-children')} 
            disabled={pending || loading}>
            { children }
            {
                (pending || loading) ? <ArrowPathIcon className="icon-loading" /> : <TrashIcon className="test" />
            }
        </button>
    )
}

export function FormDates({ createDate, updateDate }: { createDate: Date, updateDate?: Date }) {
    return (
        <div className={styles.dates}>
            <div className={styles.date}>Create at: { formatDate(createDate) }</div>
            { updateDate && <div className={styles.date}>Last update at: { formatDate(updateDate) }</div> }
        </div>
    )
}

export function InputSkeleton() {
    return (
        <div className={styles.formGroup}>
            <TextSkeleton fontSizeEm={.7} />
            <div className={styles.inputSkeleton}>#</div>
        </div>
    )
}

export function FormSkeleton({ count }: { count: number }) {
    const list = new Array(count).fill('#')
    return (
        <div className={styles.form}>
            <div className={styles.formContainer}>
                {
                    list.map((_, index) => (
                        <InputSkeleton key={index} />
                    ))
                }
            </div>
            <FormFooter>
                <ButtonSkeleton />
                <ButtonSkeleton />
            </FormFooter>
        </div>
    )
}