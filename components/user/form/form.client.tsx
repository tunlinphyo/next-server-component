'use client'

import clsx from 'clsx';
import styles from './form.module.css'
import { ChildrenProp, FormArrayType } from "@/libs/definations"
import { useFormStatus } from 'react-dom';
import { ArrowPathIcon, ChevronUpDownIcon, MapPinIcon as MapPinIconOutline, PencilSquareIcon } from '@heroicons/react/24/outline';
import { TextSkeleton } from '../utils/utils.client';
import { getCountryCodes } from './form.utils';
import { MapPinIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

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
type PhoneInputProps = {
    children?: React.ReactNode;
    name: string;
    countryCode?: string;
    defaultValue?: string;
    error?: string;
}
type TextareaProps = {
    children?: React.ReactNode;
    name: string;
    rows?: number;
    defaultValue?: string;
    error?: string;
}
type SelectProps = {
    children?: React.ReactNode;
    name: string;
    list: FormArrayType[];
    disabled?: boolean;
    defaultValue?: string;
    error?: string;
    placeholder?: string;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
type FormFooterProps = ChildrenProp & {
    center?: boolean;
}
type FormCreatButtonProps = ChildrenProp & {
    icon: any,
    full?: boolean;
}
type DisplayInputProps = ChildrenProp & {
    defaultValue: string;
}
type RadiosProp = {
    children?: React.ReactNode;
    name: string;
    list: FormArrayType[];
    defaultValue?: number | string;
    error?: string;
    customerId: number;
}
type RadioProp = {
    id: number | string;
    name: string;
    label: string;
    checked: boolean;
    customerId: number;
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

export function PhoneInput({ children, name, countryCode, defaultValue, error }: PhoneInputProps) {
    const countries = getCountryCodes()
    return (
        <div className={clsx(styles.formGroup, styles.formGroupSpan)}>
            <label htmlFor={name} className={styles.label}>{ children }</label>
            <div className={styles.inputContainer}>
                <div className={styles.phoneInput}>
                    <Select
                        name="countrycode"
                        list={countries}
                        defaultValue={countryCode || ''}
                    />
                    <input
                        className={styles.input}
                        type="tel"
                        name={name}
                        defaultValue={defaultValue || ''}
                    />
                </div>
                { error && <small>{ error }</small> }
            </div>
        </div>
    )
}

export function DisplayInput({ children, defaultValue }: DisplayInputProps) {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>{ children }</label>
            <div className={styles.inputContainer}>
                <input type="text" readOnly={true} defaultValue={defaultValue} className={styles.input} />
            </div>
        </div>
    )
}

export function Select({ children, name, list, defaultValue, error, placeholder, disabled, onChange }: SelectProps) {
    return (
        <div className={styles.formGroup}>
            <label htmlFor={name} className={styles.label}>{ children }</label>
            <div className={styles.inputContainer}>
                <div className={styles.selectContainer}>
                    <ChevronUpDownIcon />
                    <select
                        name={name}
                        defaultValue={defaultValue}
                        disabled={disabled || false}
                        onChange={onChange}
                    >
                        <option value="">{ placeholder || 'Select a value' }</option>
                        {
                            list.map((item, index) => (
                                <option key={`${item.id}-${index}`} value={item.id}>{ item.name }</option>
                            ))
                        }
                    </select>
                </div>
                { error && <small>{ error }</small> }
            </div>
        </div>
    )
}

export function AddressRadios({ children, customerId, name, list, defaultValue, error }: RadiosProp) {
    return (
        <div className={clsx(styles.formGroup, styles.formGroupSpan)}>
            <label htmlFor={name} className={styles.label}>{ children }</label>
            <div className={styles.inputContainer}>
                <div className={styles.radios}>
                    {
                        list.map(item => (
                            <AddressRadio
                                key={item.id}
                                customerId={customerId}
                                id={item.id}
                                name={name}
                                label={item.name}
                                checked={item.id == defaultValue}
                            />
                        ))
                    }
                </div>
                { error && <small>{ error }</small> }
            </div>
        </div>
    )
}

export function AddressRadio({ customerId, id, name, label, checked }: RadioProp) {
    return (
        <label className={styles.addressRadio}>
            <input type="radio" name={name} value={id} defaultChecked={checked} />
            <div className={styles.icon}>
                <MapPinIconOutline className={styles.outline} />
                <MapPinIcon className={styles.solid} />
            </div>
            <div className={styles.radioLabel}>{ label }</div>
            <Link
                className={styles.addressEdit}
                href={`/account/${customerId}/address/${id}`}
            >
                <PencilSquareIcon />
            </Link>
        </label>
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
        <button className={clsx("primary-button", "fill")} disabled={pending}>
            { children }
            { pending ? <ArrowPathIcon className="icon-loading" /> : icon }
        </button>
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
                <div className="primary-button fill skeleton" />
            </FormFooter>
        </div>
    )
}
