'use server'

import { getVariants } from "./variant.action"
import { VariantTable } from "./variant.client"

export async function VariantList({ page }: { page: number }) {
    const variants = await getVariants(null, page)
    return (
        <VariantTable variants={variants} />
    )
}

export async function ChildVariantList({ page, id }: { page: number, id: number }) {
    const variants = await getVariants(id, page)
    return (
        <VariantTable variants={variants} child={true} />
    )
}