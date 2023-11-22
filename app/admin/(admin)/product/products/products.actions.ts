'use server'

import { getZodErrors, isObjectEmpty } from "@/libs/utils"
import { CreateProductSchema, EditProductClassSchema, EditProductSchema } from "./products.schema"
import { revalidatePath } from "next/cache"
import { RedirectType, redirect } from "next/navigation"
import { PER_PAGE } from "@/libs/const"
import { getStockAndPrices } from "./products.utils"
import { deleteImage } from "@/libs/images"
import { Prisma } from "@prisma/client"
import prisma from "@/libs/prisma"
import { CategoryChildRecursive } from "../categories/categories.interface"
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

export async function getProductPageLength(key: string) {
    const query: Prisma.ProductCountArgs = {
        where: {
            AND: [
                { isDelete: false },
                {
                    name: {
                        startsWith: key ? `%${key}%` : '',
                        mode: 'insensitive',
                    }
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
                    name: {
                        startsWith: key ? `%${key}%` : '',
                        mode: 'insensitive',
                    }
                }
            ]
        },
        include: {
            images: true,
            productClasses: {
                where: { isDelete: false },
            }
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
        where: {
            id,
            productClasses: {

            }
        },
        include: {
            variant1: true,
            variant2: true,
            images: true,
            productClasses: {
                where: { isDelete: false },
                include: {
                    variant1: true,
                    variant2: true,
                }
            },
            categories: true,
        }
    }
    return await prisma.product.findUnique(query) as ProductEdit
}

export async function deleteProduct(id: number) {
    const product = await prisma.product.update({
        where: { id },
        data: { isDelete: true }
    })

    if (!product) return { code: 'Product can not delete' }

    revalidatePath('/admin/product/products')
    redirect('/admin/product/products')
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
