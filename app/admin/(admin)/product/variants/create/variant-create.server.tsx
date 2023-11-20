"use server"

import { getVariant } from "../variant.action"
import { VariantCreateForm } from "./varaiant-create.client"
import { VariantWithParent } from "../variant.interface"

export async function CreateVariant({ id }: { id?: number }) {
    let variant: VariantWithParent | undefined
    if (id) {
        variant = await getVariant(id)
    }
    return (
        <VariantCreateForm parent={variant} />
    )
}