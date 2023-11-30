import { z } from "zod"

export const ShippingSchema = z.object({
    name: z.string().min(5),
    email: z.string().email(),
    phone: z.string().min(6),
    addressId: z.coerce.number(),
    note: z.string(),
})

export const PaymentSchema = z.object({
    paymentId: z.coerce.number(),
    holderName: z.string().min(6),
    cardNumber: z.string().email(),
    expYear: z.string().min(4).max(4),
    expMonth: z.string().min(2).max(2),
    cvc: z.string().min(3).max(4),
})