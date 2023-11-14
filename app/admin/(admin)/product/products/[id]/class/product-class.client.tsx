'use client'

import { Form, FormCreatButton, FormFooter, FromDeleteButton, Input, Select } from "@/components/admin/form/form.client"
import { FormArrayType, ProductClassType, ProductType } from "@/libs/definations"
import { useFormState } from "react-dom"
import { onClassEdit, onVariantCreate, onVariantDelete } from "../../products.actions"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { generateClasses } from "./product-class.util"
import styles from './product-class.module.css'
import { useEffect } from "react"
import { appToast } from "@/libs/toasts"
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/admin/table/table.client"

type ProductClassesProp = {
    product: ProductType;
    variant1: FormArrayType[];
    variant2?: FormArrayType[];
    classes: ProductClassType[];
}

const initState = {
    variant_1_id: '',
    variant_2_id: '',
}

export function VariantSelectForm({ id, variants }: {  id: number, variants: FormArrayType[] }) {
    const [ state, onAction ] = useFormState(onVariantCreate, initState)

    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Clear <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Create Variants</FormCreatButton>
            </FormFooter>
        }>
            <input type="hidden" name="id" defaultValue={id} />
            <Select
                name="variant_1_id"
                list={variants}
                error={state?.variant_1_id}
            >Variant One</Select>
            <Select
                name="variant_2_id"
                list={variants}
                error={state?.variant_2_id}
            >Variant Two</Select>
        </Form>
    )
}

const classInitState = {
    message: '',
}

export function ClassCreateEditForm({ product, variant1, variant2, classes }: ProductClassesProp) {
    const list = generateClasses(classes, variant1, variant2)
    const [ state, onAction ] = useFormState(onClassEdit, classInitState)

    useEffect(() => {
        console.log("ERRORS", state)
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
                            <input type="hidden" name="product_id" defaultValue={product.id} />
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
                                        <input type="hidden" name={`variant_1_id_${index}`} defaultValue={item.variant1} />
                                    </TableData>
                                    <TableData>
                                        {
                                            item.variant2 && (
                                                <>
                                                    {item.name2}
                                                    <input type="hidden" name={`variant_2_id_${index}`} defaultValue={item.variant2} />
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