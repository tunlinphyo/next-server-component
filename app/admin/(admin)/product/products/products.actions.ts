'use server'

import { getCheckboxValues, getFormDataBy, getZodErrors, isObjectEmpty, wait } from "@/libs/utils"
import { CreateProductSchema, EditProductClassSchema, EditProductSchema, ProductClassSchema, VariantSchema } from "./products.schema"
import { CategoryType, FormArrayType, NestedObject, ProductClassType, ProductType, VariantType } from "@/libs/definations"
import { DELETE, GET, GET_ONE, PATCH, POST, QUERY } from "@/libs/db"
import { revalidatePath } from "next/cache"
import { RedirectType, redirect } from "next/navigation"
import { PER_PAGE } from "@/libs/const"
import { getStockAndPrices } from "./products.utils"
import { deleteImage } from "@/libs/images"
import { Prisma, ProductClass } from "@prisma/client"
import prisma from "@/libs/prisma"
import { CategoryChildRecursive } from "../categories/categories.interface"
import { VariantChildRecursive } from "../variants/variant.interface"
import { FormCategoryType, ProductEdit, ProductWithPriceAndStock } from "./products.interface"

export async function getCategories() {
    function recursive(level: number): any {
        if (level === 0) {
            return {
                include: {
                    children: true
                }
            };
        }
        return {
            include: {
                children: recursive(level - 1)
            }
        }
    }
    const query: Prisma.CategoryFindManyArgs = {
        where: { parentId: null },
        include: {
            children: recursive(4)
        }
    }
    const categories = await prisma.category.findMany(query) as CategoryChildRecursive[]

    const getFormCategory = (category: CategoryChildRecursive, children?: CategoryChildRecursive[]): FormCategoryType => {
        return {
            id: category.id,
            name: category.name,
            children: children && (
                children.map(child => getFormCategory(child, child.children))
            )
        }
    }

    const formCategories: FormCategoryType[] = []
    for await (const category of categories) {
        const formCategory = getFormCategory(category, category.children)
        formCategories.push(formCategory)
    }

    return formCategories
}

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

export async function getProductPageLength(key: string) {
    const query: Prisma.ProductCountArgs = {
        where: {
            AND: [
                { isDelete: false },
                {
                    name: { startsWith: key || '' }
                }
            ],
        }
    }

    const count = await prisma.product.count(query)

    return Math.ceil(count / PER_PAGE)
}

export async function getProducts(page: number, key: string) {
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const query: Prisma.ProductFindManyArgs = {
        where: {
            AND: [
                { isDelete: false },
                {
                    name: { startsWith: key || '' }
                }
            ]
        },
        include: {
            images: true,
            productClasses: true
        },
        skip: start,
        take: PER_PAGE,
        orderBy: { createDate: "desc" }
    }
    const result = await prisma.product.findMany(query) as ProductWithPriceAndStock[]
    for await (const product of result) {
        const { stockTotal, minPrice, maxPrice } = getStockAndPrices(product.productClasses)
        product.minPrice = minPrice
        product.maxPrice = maxPrice
        product.quantity = stockTotal
    }
    return result
}

export async function getProduct(id: number) {
    const query: Prisma.ProductFindUniqueArgs = {
        where: { id },
        include: {
            variant1: true,
            variant2: true,
            images: true,
            productClasses: {
                include: {
                    variant1: true,
                    variant2: true,
                }
            },
            categories: true,
        }
    }
    const product = await prisma.product.findUnique(query) as ProductEdit

    return product
}

export async function deleteProduct(id: number) {
    try {
        await DELETE<ProductType>('products', id)
        revalidatePath('/admin/product/products')
        redirect('/admin/product/products')
    } catch (e) {
        console.log('CAN REDIRECT ON SELF PAGE', e)
        return { code: '' }
    }
}

export async function onProductCreate(prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData)
    const category_ids = formData.getAll('category_ids').map(item => Number(item))
    const result = CreateProductSchema.safeParse({ ...data, category_ids })

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const productData = result.data
    const imagesToDelete = formData.getAll('delete_images') as string[]
    const images = formData.getAll('images') as string[]

    for await (const img of imagesToDelete) {
        await deleteImage(img)
    }


    const tResult = await prisma.$transaction(async (prisma) => {
        const product = await prisma.product.create({
            data: {
                name: productData.name,
                description: productData.description,
            }
        })
        const productCategories = await prisma.productCategory.createMany({
            data: (productData.category_ids || []).map(categoryId => ({
                productId: product.id,
                categoryId,
            })),
        });
        const productClass = await prisma.productClass.create({
            data: {
                productId: product.id,
                price: productData.price,
                quantity: productData.quantity
            }
        })
        const productImages = await prisma.productImage.createMany({
            data: images.map(img => ({
                productId: product.id,
                imgUrl: img
            }))
        })

        return { product, productCategories, productClass, productImages }
    })

    if (!tResult.product) return { code: 'Product can not create' }

    revalidatePath('/admin/product/products')
    redirect(`/admin/product/products/${tResult.product.id}/edit`, RedirectType.replace)
}

export async function onProductEdit(initState: any, formData: FormData) {
    const data = Object.fromEntries(formData)
    const category_ids = formData.getAll('category_ids').map(item => Number(item))
    const result = EditProductSchema.safeParse({ ...data, category_ids })
    const isVariant = Number(formData.get('is_variant'))

    let classResult: any
    let errors: any = {}
    if (!isVariant) {
        const classData = {
            id: formData.get('class_id'),
            price: formData.get('price'),
            quantity: formData.get('quantity')
        }
        classResult = EditProductClassSchema.safeParse(classData)
        if (!classResult.success) {
            const error = getZodErrors(classResult.error.issues)
            errors = { ...error }
        }
    }

    if (!result.success) {
        const error = getZodErrors(result.error.issues)
        return { ...errors, ...error }
    }
    if (!isObjectEmpty(errors)) return errors

    const imagesToDelete = formData.getAll('delete_images') as string[]
    const images = formData.getAll('images') as string[]

    for await (const img of imagesToDelete) {
        await deleteImage(img)
    }
    const productDBImages = await prisma.productImage.findMany({
        where: { productId: result.data.id }
    })
    const productImages = productDBImages.map(item => item.imgUrl)

    const toDeleteImages = productDBImages.filter(img => imagesToDelete.includes(img.imgUrl))
    const toAddImages = images.filter(img => !productImages.includes(img))
    
    console.log(productImages, toDeleteImages, toAddImages)

    const tResult = await prisma.$transaction(async (prisma) => {
        const product = await prisma.product.update({
            where: { id: result.data.id },
            data: {
                name: result.data.name,
                description: result.data.description,
            }
        })
        let productClass: any
        if (!isVariant && classResult.success) {
            productClass = await prisma.productClass.update({
                where: { id: classResult.data.id },
                data: {
                    price: classResult.data.price,
                    quantity: classResult.data.quantity
                }
            })
        }
        await prisma.productCategory.deleteMany({
            where: { productId: result.data.id },
        })
        const productCategories = await prisma.productCategory.createMany({
            data: (result.data.category_ids || []).map(categoryId => ({
                productId: result.data.id,
                categoryId,
            })),
        });
        await prisma.productImage.deleteMany({
            where: {
                productId: result.data.id,
                id: {
                    in: toDeleteImages.map(item => item.id)
                }
            }
        })
        await prisma.productImage.createMany({
            data: toAddImages.map(img => ({
                productId: product.id,
                imgUrl: img
            }))
        })

        return { product, productCategories, productClass }
    })

    console.log(tResult)

    if (!tResult.product) return { code: 'Product can not update' }

    revalidatePath(`/admin/product/products/${result.data.id}/edit`)
    return { message: 'success' }
}

export async function onVariantCreate(prevState: any, formData: FormData) {
    await wait()

    const result = VariantSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        console.log(getZodErrors(result.error.issues))
        return getZodErrors(result.error.issues)
    }

    const product = await prisma.product.update({
        where: { id: result.data.id },
        data: {
            variant1Id: result.data.variant1Id,
            variant2Id: result.data.variant2Id
        }
    })

    console.log("VARIANT_DATA", product)
    if (!product) return { message: 'Variant creation error' }
    revalidatePath(`/admin/product/products/${product.id}/class`)
}

export async function onClassEdit(prevState: any, formData: FormData) {
    const indexs = getCheckboxValues(formData, 'index')
    if (!indexs.length) {
        return { message: 'Please add at lease one variant' }
    }

    const productId = Number(formData.get('productId'))
    console.log(productId, indexs)

    const errors: NestedObject = {}
    const newClasses: Partial<ProductClass>[] = []
    for await (const index of indexs) {
        const result = getFormDataBy(formData, index)

        const data: Partial<ProductClass> = {
            id: result.id ? Number(result.id) : undefined,
            productId,
            variant1Id: Number(result.variant1Id),
            variant2Id: result.variant2Id ? Number(result.variant2Id) : null,
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

    console.log("CLASS_DATA______", errors, newClasses)

    if (!isObjectEmpty(errors)) {
        return errors
    }

    const tResult = await prisma.$transaction(async (prisma) => {
        const mainVariant = await prisma.productClass.findFirst({
            where: { productId, variant1Id: undefined }
        })
        if (mainVariant) {
            const disableVariant = await prisma.productClass.update({
                where: { id: mainVariant.id },
                data: { isDelete: true }
            })
        }
        const deleteAllVariants = await prisma.productClass.deleteMany({
            where: { productId, variant1Id: { not: null } },
        })
        const productCategories = await prisma.productClass.createMany({
            data: newClasses.map(newClass => newClass as ProductClass),
        });
        return { mainVariant, deleteAllVariants, productCategories }
    })

    console.log('RESULT', tResult)

    revalidatePath(`/admin/product/products/${productId}/edit`)
    revalidatePath(`/admin/product/products/${productId}/class`)
    return { message: 'Product class updated' }
}

export async function onVariantDelete(id: number) {
    await wait()

    const defaultClass = await GET_ONE<ProductClassType>('product_class', {
        product_id: id,
        variant_1_id: undefined
    })
    if (!defaultClass) return { code: 'Could not find default class' }

    const currentClasses = await GET<ProductClassType>('product_class', {
        product_id: id,
        isDelete: false
    })

    // REMOVE VARIANTS FORM PRODUCT
    await PATCH<ProductType>('products', { id, variant_1_id: undefined, variant_2_id: undefined })

    // DELETE ALL CURRENT CLASS
    for await (const current of currentClasses) {
        await PATCH<ProductClassType>('product_class', {
            id: current.id,
            isDelete: true,
        })
    }

    await PATCH<ProductClassType>('product_class', {
        id: defaultClass.id,
        isDelete: false
    })

    revalidatePath(`/admin/product/products/${id}/edit`)
    revalidatePath(`/admin/product/products/${id}/class`)
    redirect(`/admin/product/products/${id}/edit`, RedirectType.replace)
}
