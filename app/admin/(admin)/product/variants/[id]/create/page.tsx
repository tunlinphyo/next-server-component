import { BackHeader, PageContainer } from "@/components/admin/utils/utils.client"
import { CreateVariant } from "../../create/variant-create.server"
import { Suspense } from "react"
import { FormSkeleton } from "@/components/admin/form/form.client"


export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    return (
        <PageContainer>
            <BackHeader href={`/admin/product/variants/${id}/edit`}>Product Variants</BackHeader>
            <h1>Create Product Variant</h1>
            <Suspense fallback={<FormSkeleton count={3} />}>
                <CreateVariant id={id} />
            </Suspense>
        </PageContainer>
    )
}