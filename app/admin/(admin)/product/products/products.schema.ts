import { z } from "zod"

export const ProductSchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(5),
    description: z.string().min(10).max(1000),
    price: z.coerce.number().min(10),
    quantity: z.coerce.number(),
    category_ids: z.coerce.number().array().optional(),
})

export const CreateProductSchema = ProductSchema.omit({ id: true })
export const EditProductSchema = ProductSchema.omit({ price: true, quantity: true })
export const EditProductClassSchema = ProductSchema.pick({ id: true, price: true, quantity: true })

export const VariantSchema = z.object({
    id: z.coerce.number(),
    variant1Id: z.coerce.number(),
    variant2Id: z.coerce.number().optional()
}).refine((data) => data.variant1Id !== data.variant2Id, {
    message: 'Variant 1 and varinat 2 can not be the same',
    path: ["variant2Id"]
})


export const ProductClassSchema = z.object({
    productId: z.number(),
    variant1Id: z.number(),
    variant2Id: z.number().optional(),
    price: z.number().min(10),
    quantity: z.number()
})

