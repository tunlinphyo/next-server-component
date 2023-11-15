import { z } from "zod"

export const CustomerSchema = z.object({
    id: z.coerce.number(),
    avatar: z.string().optional(),
    name: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(5),
    confirm: z.string().min(5),
})

export const CreateCustomerSchema = CustomerSchema.omit({ id: true })
    .refine((data) => data.password === data.confirm, {
        message: "Passwords don't match",
        path: ["confirm"], // path of error
    })

export const EditCustomerSchema = CustomerSchema.refine((data) => data.password === data.confirm, {
        message: "Passwords don't match",
        path: ["confirm"], // path of error
    })