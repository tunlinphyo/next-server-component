'use client'

import formStyles from '../form.module.css'
import style from './category.module.css'
import { ChildrenProp, FormCategoryType } from "@/libs/definations"
import clsx from "clsx";
import { Checkbox } from "../form.client";
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

type CategorySelectProps = ChildrenProp & {
    name: string;
    list: FormCategoryType[];
    defaultValue?: number[];
    error?: string;
}
type CategoryCheckboxProps = {
    name: string;
    list: FormCategoryType[];
    checkeds: number[];
}
type CategoryLiProps = {
    name: string;
    category: FormCategoryType;
    checkeds: number[];
}

export function CategorySelect({ children, name, list, defaultValue, error }: CategorySelectProps) {
    const checkeds = defaultValue || []
    return (
        <div className={clsx(formStyles.formGroup, formStyles.formGroupSpan)}>
            <label htmlFor={name} className={formStyles.label}>{ children }</label>
            <div className={formStyles.inputContainer}>
                <div className={style.categoryContainer}>
                    <CategoryCheckbox 
                        name={name}
                        list={list}
                        checkeds={checkeds}
                    />
                </div>
                { error && <small>{ error }</small> }
            </div>
        </div>
    )
}

export function CategoryCheckbox({ name, list, checkeds }: CategoryCheckboxProps) {
    return (
        <ul className={style.categories}>
            { 
                list.map(parent => (
                    <CategoryLi 
                        key={parent.id}
                        name={name} 
                        category={parent} 
                        checkeds={checkeds} 
                    />
                ))
            }
        </ul>
    )
}

export function CategoryLi({ name, category, checkeds }: CategoryLiProps) {
    const [ toggle, setToggle ] = useState(false)
    return (
        <li className={style.category}>
            <div className={clsx(style.toggle, category.children?.length && style.hasChild)}>
                <Checkbox 
                    key={category.id} 
                    id={category.id} 
                    name={name} 
                    label={category.name}
                    checked={!!checkeds?.includes(category.id)}
                />
                {
                    category.children?.length ? (
                        <button type='button' onClick={() => setToggle(!toggle)}>
                            <ChevronDownIcon className={clsx(style.toggleIcon, toggle && style.toggleUp)} />
                        </button>
                    ) : null
                }
            </div>
            {
                category.children?.length ? (
                    <div className={clsx(style.toggleContent, (toggle ? style.open : style.close))}>
                        <CategoryCheckbox name={name} list={category.children} checkeds={checkeds} />
                    </div>
                ) : null
            }
        </li>
    )
}