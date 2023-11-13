import { z } from "zod"

export const VariantSchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(2),
    description: z.string(),
    parent_variant_id: z.coerce.number().optional(),
})

export const CreateVariantSchema = VariantSchema.omit({ id: true })