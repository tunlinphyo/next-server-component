import { z } from "zod"

export const CustomerSchema = z.object({
    id: z.coerce.number(),
    customerId: z.coerce.number(),
    name: z.string().min(5),
    // email: z.string().email(),
    country: z.string().min(2),
    state: z.string().min(2),
    city: z.string().min(2),
    address: z.string().min(5),
})

export const CustomerEditSchema = CustomerSchema.omit({ id: true }) 