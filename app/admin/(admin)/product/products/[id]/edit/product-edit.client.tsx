'use client'

import { ProductClassType, ProductType } from "@/libs/definations"
import { useFormState } from "react-dom"
import { onProductEdit } from "../../products.actions"
import { Form, FormCreatButton, FormFooter, IdContainer, Input, Textarea } from "@/components/admin/form/form.client"
import { ArrowPathIcon, CheckCircleIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline"
import { CategorySelect } from "@/components/admin/form/category/category.client"
import styles from "./product-edit.module.css"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { appToast } from "@/libs/toasts"
import { formatPrice } from "@/libs/utils"
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/admin/table/table.client"
import { appConfirm } from "@/libs/modals"
import { ImageUpload } from "@/components/admin/form/files/files.client"
import { Budge } from "@/components/admin/utils/utils.client"
import { FormCategoryType, ProductEdit } from "../../products.interface"

type ProductEditProps = {
    product: ProductEdit;
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

export function ProductEditForm({ product, categories }: ProductEditProps) {
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
            {/* <ImageUpload
                name="images"
                defaultValue={product.images}
            >
                Images (optional)
            </ImageUpload> */}
            <Textarea
                rows={10}
                name="description"
                defaultValue={product.description}
                error={state?.description}
            >
                Description
            </Textarea>
            {
                (product.productClasses.length == 1 && !product.productClasses[0].variant1Id) ? <>
                    <input type="hidden" name="is_variant" defaultValue="0" />
                    <input type="hidden" name="class_id" defaultValue={product.productClasses[0].id} />
                    <Input
                        type="number"
                        name="price"
                        defaultValue={String(product.productClasses[0].price)}
                        error={state?.price}
                    >
                        Price
                    </Input>
                    <Input
                        type="number"
                        name="quantity"
                        defaultValue={String(product.productClasses[0].quantity)}
                        error={state?.quantity}
                    >
                        Quantity
                    </Input>
                </> : <input type="hidden" name="is_variant" defaultValue="1" />
            }
            <CategorySelect
                name="category_ids"
                list={categories}
                defaultValue={product.categories.map(item => item.categoryId)}
            >
                Categories
            </CategorySelect>
            <ClassForm product={product} />
        </Form>
    )
}

export function ClassForm({ product }: { product: ProductEdit }) {
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
            product.productClasses.length == 1 && !product.productClasses[0].variant1Id ? (
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
                        <colgroup>
                            <col width="15%" />
                            <col width="20%" />
                            <col width="20%" />
                            <col width="20%" />
                            <col width="15%" />
                        </colgroup>
                        <TableHeader>
                            <TableHead>#</TableHead>
                            <TableHead>{ product.variant1?.name }</TableHead>
                            <TableHead>{ product.variant2?.name }</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                        </TableHeader>
                        <TableBody>
                            {
                                product.productClasses
                                .filter(item => !item.isDelete)
                                .map(item => (
                                    <TableRow key={item.id}>
                                        <TableData>
                                            <IdContainer id={item.id} />
                                        </TableData>
                                        <TableData>{ item.variant1?.name }</TableData>
                                        <TableData>{ item.variant2?.name }</TableData>
                                        <TableData>{ formatPrice(item.price) }</TableData>
                                        <TableData>
                                            <Budge>{ item.quantity }</Budge>
                                        </TableData>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
            )
    )
}