'use client'

import { Form, FormCreatButton, FormFooter, FromDeleteButton, Input, Select } from "@/components/admin/form/form.client"
import { FormArrayType } from "@/libs/definations"
import { useFormState } from "react-dom"
import { onClassEdit, onVariantCreate, onVariantDelete } from "../../product-class.actions"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { generateClasses } from "./product-class.util"
import styles from './product-class.module.css'
import { useEffect } from "react"
import { appToast } from "@/libs/toasts"
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/admin/table/table.client"
import { ProductEdit } from "../../products.interface"

type ProductClassesProp = {
    product: ProductEdit;
    variant1: FormArrayType[];
    variant2?: FormArrayType[];
}

const initState = {
    variant1Id: '',
    variant2Id: '',
}

export function VariantSelectForm({ id, variants }: {  id: number, variants: FormArrayType[] }) {
    const [ state, onAction ] = useFormState(onVariantCreate, initState)

    useEffect(() => {
        if (state?.message) appToast(state.message)
    }, [ state ])

    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Clear <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Create Variants</FormCreatButton>
            </FormFooter>
        }>
            <input type="hidden" name="id" defaultValue={id} />
            <Select
                name="variant1Id"
                list={variants}
                error={
                    // @ts-ignore
                    state?.variant1Id
                }
            >Variant One</Select>
            <Select
                name="variant2Id"
                list={variants}
                error={
                    // @ts-ignore
                    state?.variant2Id
                }
            >Variant Two</Select>
        </Form>
    )
}

const classInitState = {
    message: '',
}

export function ClassCreateEditForm({ product, variant1, variant2 }: ProductClassesProp) {
    const list = generateClasses(product.productClasses, variant1, variant2)
    const [ state, onAction ] = useFormState(onClassEdit, classInitState)

    useEffect(() => {
        if (state.message) appToast(state.message)
    }, [ state ])

    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Reset <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Create Variants</FormCreatButton>
            </FormFooter>
        }>
            <div className={styles.productClasses}>
                <Table>
                    <colgroup>
                        <col width="5%" />
                        <col width="20%" />
                        <col width="20%" />
                        <col width="20%" />
                        <col width="15%" />
                    </colgroup>
                    <TableHeader>
                        <TableHead>
                            <input type="hidden" name="productId" defaultValue={product.id} />
                        </TableHead>
                        <TableHead>{ product.variant1?.name }</TableHead>
                        <TableHead>{ product.variant2?.name }</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                    </TableHeader>
                    <TableBody>
                        {
                            list.map((item, index) => (
                                <TableRow key={index}>
                                    <TableData>
                                        <input type="hidden" name={`id_${index}`} defaultValue={item.id} />
                                        <input
                                            className={styles.checkbox}
                                            type="checkbox"
                                            name={`index_${index}`}
                                            defaultValue={index}
                                            defaultChecked={!!item.id} />
                                    </TableData>
                                    <TableData>
                                        { item.name1 }
                                        <input type="hidden" name={`variant1Id_${index}`} defaultValue={item.variant1} />
                                    </TableData>
                                    <TableData>
                                        {
                                            item.variant2 && (
                                                <>
                                                    {item.name2}
                                                    <input type="hidden" name={`variant2Id_${index}`} defaultValue={item.variant2} />
                                                </>
                                            )
                                        }
                                    </TableData>
                                    <TableData>
                                        <Input
                                            name={`price_${index}`}
                                            defaultValue={item.price}
                                            error={state[String(index)]?.price}
                                        />
                                    </TableData>
                                    <TableData>
                                        <Input
                                            name={`quantity_${index}`}
                                            defaultValue={item.quantity}
                                            error={state[String(index)]?.quantity}
                                        />
                                    </TableData>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </Form>
    )
}

export function ClassDeleteForm({ id }: { id: number }) {
    return (
        <div className={styles.variants}>
            <FromDeleteButton action={onVariantDelete.bind(null, id)}>
                Delete Variants
            </FromDeleteButton>
        </div>
    )
}