import { z } from "zod"

export const AddressSchema = z.object({
    customerId: z.coerce.number(),
    country: z.string().min(2),
    state: z.string().min(2),
    city: z.string().min(2),
    address: z.string().min(5),
})