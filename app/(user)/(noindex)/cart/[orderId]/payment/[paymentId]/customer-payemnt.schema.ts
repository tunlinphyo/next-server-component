import { z } from "zod"

export const CustomerPaymentSchema = z.object({
    customerId: z.coerce.number(),
    paymentId: z.coerce.number().min(1),
    holderName: z.string().min(6),
    cardNumber: z.string().min(16).max(16),
    expYear: z.string().min(4).max(4),
    expMonth: z.string().min(1).max(2),
    cvc: z.string().min(3).max(4),
})