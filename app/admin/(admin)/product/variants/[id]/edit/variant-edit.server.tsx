'use server'

import { redirect } from "next/navigation"
import { getVariant } from "../../variant.action"
import { VariantEditForm } from "./variant-edit.client"
import { FormDates } from "@/components/admin/form/form.client"


export async function VariantEdit({ id, page }: { id: number, page: number }) {
    const variant = await getVariant(id)
    if (!variant) redirect('/admin/variants')
    return (
        <>
            <VariantEditForm variant={variant} />
            <FormDates createDate={variant.createDate} updateDate={variant.updateDate} />
        </>
    )
}