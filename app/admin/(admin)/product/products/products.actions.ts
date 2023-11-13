'use server'

import { getCheckboxValues, getFormDataBy, getZodErrors, isObjectEmpty, wait } from "@/libs/utils";
import { CreateProductSchema, EditProductClassSchema, EditProductSchema, ProductClassSchema, VariantSchema } from "./products.schema";
import { CategoryType, FormArrayType, FormCategoryType, GenericObject, NestedObject, ProductClassType, ProductType, VariantType } from "@/libs/definations";
import { DELETE, GET, GET_ONE, PATCH, POST } from "@/libs/db";
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PER_PAGE } from "@/libs/const";

export async function getAllCategories() {
    await wait()

    const getFormCategory = (category: CategoryType, children?: CategoryType[]): FormCategoryType => {
        return {
            id: category.id,
            name: category.name,
            children: children && (
                children.map(child => getFormCategory(child, child.children))
            )
        }
    }

    const categories = await GET<CategoryType>('product_categories', { parent_category_id: undefined, isDelete: false })

    const formCategories: FormCategoryType[] = []
    for await (const category of categories) {
        const cateogryWithChildren = await _getChildCategories(category)
        const formCategory = getFormCategory(cateogryWithChildren, cateogryWithChildren.children)
        formCategories.push(formCategory)
    }

    return formCategories
}

async function _getChildCategories(category: CategoryType) {
    const children = await GET<CategoryType>('product_categories', { parent_category_id: category.id, isDelete: false }) 
    if (children.length) {
        category.children = []
        for await (const child of children) {
            category.children.push(await _getChildCategories(child))
        }
    }
    return category
}

export async function getAllVariants(parent_variant_id?: number) {
    await wait()

    const variants = await GET<VariantType>('product_variants', { parent_variant_id, isDelete: false })
    return variants.map(item => {
        return {
            id: item.id,
            name: item.name
        } as FormArrayType
    })
}

export async function getProductPageLength() {
    await wait()

    const products = await GET<ProductType>('products', { isDelete: false })
    return Math.ceil(products.length / PER_PAGE)
}

export async function getProducts(page: number = 1) {
    await wait()

    const products = await GET<ProductType>('products', { isDelete: false })
    const index = page - 1
    const start = index ? index * PER_PAGE : 0
    const end = start + PER_PAGE
    const sortedProducts = products.sort((a, b) => {
        if (a.createDate < b.createDate) return 1
        if (a.createDate > b.createDate) return -1
        return 0
    })
    const paginated = sortedProducts.slice(start, end)
    const result: ProductType[] = []
    for await (const product of paginated) {
        const productClasses = await GET<ProductClassType>('product_class', { product_id: product.id, isDelete: false })
        if (productClasses) {
            // product.classes = productClasses
            product.price = productClasses[0]?.price
            product.quantity = productClasses[0]?.quantity
        }
        result.push(product)
    }
    return result
}

export async function getProduct(id: number) {
    await wait()

    const product = await GET_ONE<ProductType>('products', { id, isDelete: false })
    if (!product) return undefined
    if (product.variant_1_id) {
        const variant1 = await GET_ONE<VariantType>('product_variants', { id: product.variant_1_id })
        product.variant1 = variant1
    }
    if (product.variant_2_id) {
        const variant2 = await GET_ONE<VariantType>('product_variants', { id: product.variant_2_id })
        product.variant2 = variant2
    }
    const classes = await GET<ProductClassType>('product_class', { product_id: product?.id, isDelete: false })
    if (classes.length == 0) return undefined
    product.price = classes[0].price
    product.quantity = classes[0].quantity
    product.classes = classes
    
    return product
}

export async function getActiveClasses(id: number) {
    await wait()

    const classes = await GET<ProductClassType>('product_class', { product_id: id, isDelete: false })

    for await (const item of classes) {
        if (item.variant_1_id) {
            const variant = await GET_ONE<VariantType>('product_variants', { id: item.variant_1_id })
            item.variant1 = variant
        }
        if (item.variant_2_id) {
            const variant = await GET_ONE<VariantType>('product_variants', { id: item.variant_2_id })
            item.variant2 = variant
        }
    }

    return classes
}

export async function deleteProduct(id: number) {
    try {
        await DELETE<ProductType>('products', id)
        revalidatePath('/admin/product/products')
        redirect('/admin/product/products')
    } catch(e) {
        console.log('CAN REDIRECT ON SELF PAGE', e)
        return { code: '' }
    }
}

export async function onProductCreate(prevState: any, formData: FormData) {
    const data = Object.fromEntries(formData)
    const category_ids = getCheckboxValues(formData, 'category_ids')
    const result = CreateProductSchema.safeParse({ ...data, category_ids })

    if (!result.success) {
        return getZodErrors(result.error.issues)
    }

    const productData = result.data

    const newProduct: ProductType = {
        id: 1,
        name: productData.name,
        description: productData.description,
        image: productData.image,
        category_ids,
        createDate: new Date(),
        isDelete: false
    }

    const product = await POST<ProductType>('products', newProduct)
    console.log('NEW_PRODUCT', product)

    await wait(300) // add not do duplicate id
    const newProductClass: ProductClassType = {
        id: 1,
        product_id: product.id,
        price: productData.price,
        quantity: productData.quantity,
        createDate: new Date(),
        isDelete: false
    }
    const productClass = await POST<ProductClassType>('product_class', newProductClass)
    console.log('PRODUCT_CLASS', productClass)

    revalidatePath('/admin/product/products')
    redirect(`/admin/product/products/${product.id}/edit`)
}

export async function onProductEdit(initState: any, formData: FormData) {
    await wait()

    const data = Object.fromEntries(formData)
    const category_ids = getCheckboxValues(formData, 'category_ids')
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

    await PATCH<ProductType>('products', result.data)
    if (!isVariant && classResult.success) {
        const productClass = await GET_ONE<ProductClassType>('product_class', {
            id: classResult.data.id,
            product_id: result.data.id,
            isDelete: false
        })
        if (!productClass) return { message: 'Product class do not exit' }
        console.log("CLASS", classResult.data)
        await PATCH<ProductClassType>('product_class', classResult.data)
    }
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

    const product = await PATCH<ProductType>('products', result.data)

    console.log("VARIANT_DATA", product)
    if (!product) return { message: 'Variant creation error' }
    revalidatePath(`/admin/product/products/${product.id}/class`)
}

export async function onClassEdit(prevState: any, formData: FormData) {
    await wait()

    const indexs = getCheckboxValues(formData, 'index')
    if (!indexs.length) {
        return { message: 'Please add at lease one variant' }
    }

    const product_id = formData.get('product_id')
    const oldClasses = await GET<ProductClassType>('product_class', { product_id, isDelete: false })

    const errors: NestedObject = {}
    const newClasses: Partial<ProductClassType>[] = []
    for await (const index of indexs) {
        const result = getFormDataBy(formData, index)
        
        const data: Partial<ProductClassType> = {
            id: result.id ? Number(result.id) : undefined,
            product_id: Number(product_id),
            variant_1_id: Number(result.variant_1_id),
            variant_2_id: result.variant_2_id ? Number(result.variant_2_id) : undefined,
            price: result.price ? Number(result.price) : undefined,
            quantity: result.price ? Number(result.quantity) : undefined,
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

    console.log("ERRORS", errors)

    if (!isObjectEmpty(errors)) {
        return errors
    }

    // DELETE ALL CLASS
    for await (const oldClass of oldClasses) {
        await PATCH<ProductClassType>('product_class', { ...oldClass, isDelete: true })
    }

    // ADD OR UPDATE CLASS
    for await (const classData of newClasses) {
        let newClass: ProductClassType | undefined
        if (classData.id) {
            newClass = await PATCH<ProductClassType>('product_class', classData)
        } else {
            newClass = await POST<ProductClassType>('product_class', classData)
        }
        console.log('NEW_CLASS', newClass)
    }

    revalidatePath(`/admin/product/products/${product_id}/edit`)
    revalidatePath(`/admin/product/products/${product_id}/class`)
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
    redirect(`/admin/product/products/${id}/edit`)
}
