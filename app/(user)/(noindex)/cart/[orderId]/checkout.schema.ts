import { z } from "zod"

export const ShippingSchema = z.object({
    name: z.string().min(5),
    email: z.string().email(),
    phone: z.string().min(6),
    addressId: z.coerce.number(),
    note: z.string(),
})