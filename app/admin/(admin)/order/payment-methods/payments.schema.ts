import { z } from "zod"

export const PaymentSchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(4),
    logo: z.string().optional(),
    image: z.string().optional(),
    isCredit: z.coerce.boolean(),
    isDisabled: z.coerce.boolean(),
})

export const CreatePaymentSchema = PaymentSchema.omit({ id: true })
