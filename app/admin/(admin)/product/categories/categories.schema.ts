import { z } from "zod"

export const CategorySchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(3),
    parent_category_id: z.coerce.number().optional(),
})

export const CreateCategorySchema = CategorySchema.omit({ id: true })