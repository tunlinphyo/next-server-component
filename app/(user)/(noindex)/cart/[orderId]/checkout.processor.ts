import { Order } from "@prisma/client"
import { ShippingSchema } from "./checkout.schema";
import { getZodErrors } from "@/libs/utils";

export interface ProcessorReturn {
    errors: string[];
    success: boolean;
    data?: any;
}

export function shippingProcessor(order: Order): ProcessorReturn {
    const errors: string[] = []

    const result = ShippingSchema.safeParse(order)

    if (!result.success) {
        const errorObj = getZodErrors(result.error.issues)
        Object.values(errorObj).forEach(message => {
            errors.push(message)
        })
    }

    return {
        success: !errors.length,
        errors
    }
}