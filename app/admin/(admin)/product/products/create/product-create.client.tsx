'use client'

import { useFormState } from "react-dom"
import { onProductCreate } from "../products.actions"
import { Form, FormCreatButton, FormFooter, Input, Textarea } from "@/components/admin/form/form.client"
import { ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import { CategorySelect } from "@/components/admin/form/category/category.client"
import { ImageUpload } from "@/components/admin/form/files/files.client"
import { FormCategoryType } from "../products.interface"
import { useEffect } from "react"
import { appToast } from "@/libs/toasts"
import { useRouter } from "next/navigation"

const initState = {
    name: '',
    description: '',
    image: '',
    quantity: '',
    price: '',
    category_ids: '',
    class_ids: ''
}

export function ProductCreateForm({ categories }: { categories: FormCategoryType[] }) {
    const [ state, onAction ] = useFormState(onProductCreate, initState)
    const { replace } = useRouter()

    useEffect(() => {
        if (state.message) appToast(state.message)
        if (state.replace) replace(`/admin/product/products/${state.replace}/edit`)
    }, [ state ])

    return (
        <Form action={onAction} footer={
            <FormFooter>
                <button type="reset">Clear <ArrowPathIcon /></button>
                <FormCreatButton icon={<CheckCircleIcon />}>Create Product</FormCreatButton>
            </FormFooter>
        }>
            <Input
                name="name"
                error={state?.name}
            >
                Name
            </Input>
            <ImageUpload
                name="images"
            >
                Images (optional)
            </ImageUpload>
            <Textarea
                name="description"
                error={state?.description}
                rows={10}
            >
                Description
            </Textarea>
            <Input
                type="number"
                name="price"
                error={state?.price}
            >
                Price
            </Input>
            <Input
                type="number"
                name="quantity"
                error={state?.quantity}
            >
                Quantity
            </Input>
            <CategorySelect
                name="category_ids"
                list={categories}
            >
                Categories (optional)
            </CategorySelect>
        </Form>
    )
}

