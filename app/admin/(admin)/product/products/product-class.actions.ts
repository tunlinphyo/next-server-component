'use server'

import { getCheckboxValues, getFormDataBy, getZodErrors, isObjectEmpty } from "@/libs/utils"
import { ProductClassSchema, VariantSchema } from "./products.schema"
import { NestedObject } from "@/libs/definations"
import { revalidatePath } from "next/cache"
import { RedirectType, redirect } from "next/navigation"
import { ProductClass } from "@prisma/client"
import { Prisma } from "@prisma/client"
import prisma from "@/libs/prisma"
import { FormArrayType } from "@/libs/definations"
import { ClassCreate, ClassEdit } from "./products.interface"

export async function getVariants(id?: number) {
    const query: Prisma.VariantFindManyArgs = {
        where: { parentId: id ?? null, isDelete: false },
    }

    const variants = await prisma.variant.findMany(query)
    return variants.map(item => {
        return {
            id: item.id,
            name: item.name
        } as FormArrayType
    })
}

export async function onVariantCreate(prevState: any, formData: FormData) {
    try {
        const result = VariantSchema.safeParse(Object.fromEntries(formData))
        if (!result.success) {
            console.log(getZodErrors(result.error.issues))
            return getZodErrors(result.error.issues)
        }
        console.log(result.data)
        let data: Record<string, number> = {
            variant1Id: result.data.variant1Id,
        }
        if (result.data.variant2Id) {
            data.variant2Id = result.data.variant2Id
        }
        const product = await prisma.product.update({
            where: { id: result.data.id },
            data
        })
        console.log("VARIANT_DATA", product)
        if (!product) return { message: 'Variant creation error' }
        revalidatePath(`/admin/product/products/${product.id}/class`)
    } catch (error: any) {
        return { message: error.message }
    }
}

export async function onClassEdit(prevState: any, formData: FormData) {
    const indexs = getCheckboxValues(formData, 'index')
    if (!indexs.length) {
        return { message: 'Please add at lease one variant' }
    }

    const productId = Number(formData.get('productId'))
    console.log(productId, indexs)

    const errors: NestedObject = {}
    const newClasses: ClassEdit[] = []
    for await (const index of indexs) {
        const result = getFormDataBy(formData, index)

        const data: ClassEdit = {
            productId,
            variant1Id: Number(result.variant1Id),
            variant2Id: result.variant2Id ? Number(result.variant2Id) : undefined,
            price: result.price ? Number(result.price) : 0,
            quantity: result.price ? Number(result.quantity) : 0,
            isDelete: false,
        }

        const validate = ProductClassSchema.safeParse(data)

        if (!validate.success) {
            const error = getZodErrors(validate.error.issues)
            errors[result.index] = error
        } else {
            newClasses.push(data)
        }
    }

    if (!isObjectEmpty(errors)) {
        console.log('ERRORS_________', errors)
        return errors
    }
    const allClasses = await prisma.productClass.findMany({
        where: { productId }
    })
    const toUpdateClasses: ClassCreate[] = []
    const toDisableClasses: ProductClass[] = []
    const toCreateClass: ClassEdit[] = []

    for (const dbClass of allClasses) {
        const updatedClass = newClasses.find(item =>
            item.variant1Id === dbClass.variant1Id
            && item.variant2Id === dbClass.variant2Id
        )
        if (!dbClass.variant1Id) {
            toDisableClasses.push(dbClass)
        } else if (updatedClass) {
            toUpdateClasses.push({
                ...updatedClass,
                id: dbClass.id,
            })
        } else {
            toDisableClasses.push(dbClass)
        }
    }
    for(const newClass of newClasses) {
        if (!toUpdateClasses.find(item => (
            item.variant1Id === newClass.variant1Id
            && item.variant2Id === newClass.variant2Id
        ))) {
            toCreateClass.push(newClass)
        }
    }

    console.log('CLASSES_________________', toDisableClasses, toUpdateClasses)

    const tResult = await prisma.$transaction(async (prisma) => {
        const disabledClass = await prisma.productClass.updateMany({
            where: {
                id: { in: toDisableClasses.map(item => item.id) }
            },
            data: { isDelete: true }
        })
        for await (const data of toUpdateClasses) {
            await prisma.productClass.update({
                where: { id: data.id },
                data,
            })
        }
        const createdClasses = await prisma.productClass.createMany({
            data: toCreateClass.map(newClass => newClass)
        })

        return { disabledClass, createdClasses }
    })

    console.log('RESULT', tResult)

    revalidatePath(`/admin/product/products/${productId}/edit`)
    revalidatePath(`/admin/product/products/${productId}/class`)
    return { message: 'Product class updated' }
}

export async function onVariantDelete(id: number) {
    const tResult = await prisma.$transaction(async (prisma) => {
        const product = await prisma.product.update({
            where: { id },
            data: {
                variant1Id: null,
                variant2Id: null,
            }
        })
        const enableMainClass = await prisma.productClass.updateMany({
            where: { variant1Id: null },
            data: { isDelete: false }
        })
        const disableClasses = await prisma.productClass.updateMany({
            where: { variant1Id: { not: null } },
            data: { isDelete: true }
        })

        return { product, enableMainClass, disableClasses }
    })
    console.log('ON_CLASS_DELETE_____', tResult)

    revalidatePath(`/admin/product/products/${id}/edit`)
    revalidatePath(`/admin/product/products/${id}/class`)
    redirect(`/admin/product/products/${id}/edit`, RedirectType.replace)
}
