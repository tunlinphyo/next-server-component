import { BackHeader, PageContainer } from "@/components/admin/utils/utils.client"
import { CreateCategory } from "../../create/category-create.server"
import { Suspense } from "react"
import { FormSkeleton } from "@/components/admin/form/form.client"

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    return (
        <PageContainer>
            <BackHeader href={`/admin/product/categories/${id}/edit`}>Product Categories</BackHeader>
            <h1>Create Product Category</h1>
            <Suspense fallback={<FormSkeleton count={2} />}>
                <CreateCategory id={id} />
            </Suspense>
        </PageContainer>
    )
}