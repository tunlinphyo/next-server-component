import { z } from "zod"

export const ShippingSchema = z.object({
    name: z.string().min(5),
    email: z.string().email(),
    phone: z.string().min(6),
    addressId: z.coerce.number().min(1),
    note: z.string().optional(),
})

export const PaymentSchema = z.object({
    orderId: z.coerce.number().min(1, { message: 'Order ID is required' }),
    customerId: z.coerce.number().min(1, { message: 'Customer ID is required' }),
    customerPaymentId: z.coerce.number().min(1, { message: 'Payment is required' }),
    paymentId: z.coerce.number().min(1),
})

export const CheckoutSchema = ShippingSchema.extend({
    subTotal: z.coerce.number().min(1),
    deliveryAmount: z.coerce.number().min(1),
    totalAmount: z.coerce.number().min(1),
    paymentAmount: z.coerce.number(),
    customerId: z.coerce.number().min(1),
    customerPaymentId: z.coerce.number().min(1),

})