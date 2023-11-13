'use client'

import { FormCategoryType, ProductClassType, ProductType } from "@/libs/definations"
import { useFormState } from "react-dom"
import { onProductEdit } from "../../products.actions"
import { Form, FormCreatButton, FormFooter, Input, Textarea } from "@/components/admin/form/form.client"
import { ArrowPathIcon, CheckCircleIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline"
import { CategorySelect } from "@/components/admin/form/category/category.client"
import styles from "./product-edit.module.css"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { appToast } from "@/libs/toasts"
import { formatPrice } from "@/libs/utils"
import clsx from "clsx"
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/admin/table/table.client"
import { appConfirm } from "@/libs/modals"

type ProductEditProps = {
    product: ProductType; 
    classes: ProductClassType[];
    categories: FormCategoryType[];
}

const initState = {
    name: '',
    description: '',
    image: '',
    quantity: '',
    price: '',
    category_ids: '',
    class_ids: '',
    message: ''
}

export function ProductEditForm({ product, classes, categories }: ProductEditProps) {
    const [ state, onAction ] = useFormState(onProductEdit, initState)

    useEffect(() => {
        if (state.message) appToast(state.message)
    }, [ state ])

    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Reset <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Edit Product</FormCreatButton>
            </FormFooter>
        }>
            <input type="hidden" name="id" defaultValue={product.id} />
            <Input
                name="name"
                defaultValue={product.name}
                error={state?.name}
            >
                Name
            </Input>
            <Textarea
                name="description"
                defaultValue={product.description}
                error={state?.description}
            >
                Description
            </Textarea>
            {
                (classes.length == 1 && !classes[0].variant_1_id) ? <>
                    <input type="hidden" name="is_variant" defaultValue="0" />
                    <input type="hidden" name="class_id" defaultValue={classes[0].id} />
                    <Input
                        type="number"
                        name="price"
                        defaultValue={String(product.price)}
                        error={state?.price}
                    >
                        Price
                    </Input>
                    <Input
                        type="number"
                        name="quantity"
                        defaultValue={String(product.quantity)}
                        error={state?.quantity}
                    >
                        Quantity
                    </Input>
                </> : <input type="hidden" name="is_variant" defaultValue="1" />
            }
            <CategorySelect 
                name="category_ids"
                list={categories}
                defaultValue={product.category_ids}
            >
                Categories
            </CategorySelect>
            <ClassForm product={product} classes={classes} />
        </Form>
    )
}

export function ClassForm({ product, classes }: { product: ProductType, classes: ProductClassType[] }) {
    const { push } = useRouter()
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const isSave = await appConfirm('Save product before continue?', {
            cancelText: 'no',
            confirmText: 'yes'
        })
        if (isSave) {
            const buttonEl = event.target as HTMLButtonElement 
            const formEl = buttonEl.closest('form')
            await formEl?.requestSubmit()
        }
        push(`/admin/product/products/${product.id}/class`)
    }
    return (
            classes.length == 1 && !classes[0].variant_1_id ? (
                <div className={styles.variants}>
                    <button type="button" onClick={handleClick}>
                        Add variant <PlusIcon />
                    </button>
                </div>
            ) : (
                <div className={styles.productClasses}>
                    <div className={styles.classAction}>
                        <button type="button" onClick={handleClick}>
                            Edit variants <PencilIcon />
                        </button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableHead>#</TableHead>
                            <TableHead>{ product.variant1?.name }</TableHead>
                            <TableHead>{ product.variant2?.name }</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                        </TableHeader>
                        <TableBody>
                            {
                                classes.map(item => (
                                    <TableRow key={item.id}>
                                        <TableData>{ item.id }</TableData>
                                        <TableData>{ item.variant1?.name }</TableData>
                                        <TableData>{ item.variant2?.name }</TableData>
                                        <TableData>{ formatPrice(item.price) }</TableData>
                                        <TableData>{ item.quantity }</TableData>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            )
    )
}