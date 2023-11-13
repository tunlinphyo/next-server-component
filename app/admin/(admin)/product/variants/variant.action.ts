"use server"

import { PER_PAGE } from "@/libs/const"
import { DELETE, GET, GET_ONE, PATCH, POST } from "@/libs/db"
import { VariantType } from "@/libs/definations"
import { getZodErrors, wait } from "@/libs/utils"
import { CreateVariantSchema, VariantSchema } from "./variant.schema"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getVariantPageLength(id?: number) {
    await wait()

    const query: Partial<VariantType> = {
        isDelete: false
    }
    if (id) {
        query.parent_variant_id = id
    } else {
        query.parent_variant_id = undefined
    }

    const variants = await GET<VariantType>('product_variants', query)
    return Math.ceil(variants.length / PER_PAGE)
}

export async function getPariantVariants(page: number = 1) {
    await wait()

    const variants = await GET<VariantType>('product_variants', { parent_variant_id: undefined, isDelete: false })
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const end = start + PER_PAGE
    const sortedVariants = variants.sort((a, b) => {
        if (a.createDate < b.createDate) return 1
        if (a.createDate > b.createDate) return -1
        return 0
    })
    const paginated = sortedVariants.slice(start, end)
    const result: VariantType[] = []
    for await (const variant of paginated) {
        const childs = await GET<VariantType>('product_variants', { parent_variant_id: variant.id, isDelete: false })
        variant.child_count = childs.length
        result.push(variant)
    }
    return result
}

export async function getChildVariants(id: number, page: number = 1) {
    await wait()

    const variants = await GET<VariantType>('product_variants', { parent_variant_id: id, isDelete: false })
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const end = start + PER_PAGE
    const sortedCategories = variants.sort((a, b) => {
        if (a.createDate > b.createDate) return 1
        if (a.createDate < b.createDate) return -1
        return 0
    })
    const paginated = sortedCategories.slice(start, end)
    const result: VariantType[] = []
    for await (const varinat of paginated) {
        const parent = await GET_ONE<VariantType>('product_variants', { id: varinat.parent_variant_id, isDelete: false })
        varinat.parent_variant = parent
        result.push(varinat)
    }
    return result
}

export async function getVariant(id: number) {
    await wait()

    const variant = await GET_ONE<VariantType>('product_variants', { id, isDelete: false })
    if (variant && variant.parent_variant_id) {
        const parent = await GET_ONE<VariantType>('product_variants', { id: variant.parent_variant_id, isDelete: false })
        variant.parent_variant = parent
    }
    return variant
}

export async function deleteVariant(id: number) {
    await wait()

    const childVariants = await GET<VariantType>('product_variants', { parent_variant_id: id, isDelete: false })
    if (childVariants.length) return { code: 'Can not delete a variant with children' }
    try {
        await DELETE<VariantType>('product_variants', id)
        revalidatePath('/admin/product/variants')
        redirect('/admin/product/variants')
    } catch(e) {
        console.log('CAN REDIRECT ON SELF PAGE', e)
        return { code: '' }
    }
}

export async function onVariantCreate(prevState: any, formData: FormData) {
    await wait()

    const result = CreateVariantSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    // const isName = await GET_ONE<VariantType>('product_variants', { name: result.data.name, isDelete: false })
    // if (isName) {
    //     return { name: 'Variant name is already in used' }
    // }

    const newVariant = {
        id: Date.now(),
        ...result.data,
        createDate: new Date(),
        isDelete: false
    }

    const newData = await POST<VariantType>('product_variants', newVariant)
    if (newVariant.parent_variant_id) {
        revalidatePath(`/admin/product/variants/${newVariant.parent_variant_id}/edit`)
        redirect(`/admin/product/variants/${newVariant.parent_variant_id}/edit`)
    } else {
        revalidatePath('/admin/product/variants')
        redirect(`/admin/product/variants/${newData.id}/edit`)
    }
}

export async function onVariantEdit(prevState: any, formData: FormData) {
    await wait()

    const result = VariantSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const isName = await GET_ONE<VariantType>('product_variants', { name: result.data.name, isDelete: false })
    if (isName && isName.id !== result.data.id) {
        return { name: 'Variant name is already in used' }
    }

    const editedVariant = {
        ...result.data,
        updateDate: new Date(),
    } as VariantType

    const updatedVariant = await PATCH<VariantType>('product_variants', editedVariant)
    if (updatedVariant?.parent_variant_id) {
        revalidatePath(`/admin/product/variants/${updatedVariant.parent_variant_id}/edit`)
        redirect(`/admin/product/variants/${updatedVariant.parent_variant_id}/edit`)
    } else {
        revalidatePath('/admin/product/variants')
        redirect('/admin/product/variants')
    }
}