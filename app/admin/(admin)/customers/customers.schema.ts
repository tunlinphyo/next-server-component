import { z } from "zod"

export const CustomerSchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(5),
    email: z.string().email(),
})

export const CreateCustomerSchema = CustomerSchema.omit({ id: true })