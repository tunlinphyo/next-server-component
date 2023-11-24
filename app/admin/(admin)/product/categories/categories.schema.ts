import { z } from "zod"

export const CategorySchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(3),
    description: z.string().optional(),
    parentId: z.coerce.number().optional(),
})

export const CreateCategorySchema = CategorySchema.omit({ id: true })