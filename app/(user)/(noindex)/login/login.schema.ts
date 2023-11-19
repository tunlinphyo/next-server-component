import { z } from "zod"

export const UserSchema = z.object({
    id: z.coerce.number(),
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
})

export const LoginSchema = UserSchema.pick({ email: true, password: true })