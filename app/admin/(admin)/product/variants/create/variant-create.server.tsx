"use server"

import { VariantType } from "@/libs/definations"
import { getVariant } from "../variant.action"
import { VariantCreateForm } from "./varaiant-create.client"

export async function CreateVariant({ id }: { id?: number }) {
    let variant: VariantType | undefined
    if (id) {
        variant = await getVariant(id)
    }
    return (
        <VariantCreateForm parent={variant} />
    )
}