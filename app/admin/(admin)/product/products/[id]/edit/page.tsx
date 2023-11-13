import { BackHeader, FlexBetween, PageContainer } from "@/components/admin/utils/utils.client"
import { FormSkeleton, FromDeleteButton } from "@/components/admin/form/form.client"
import { Suspense } from "react"
import { deleteProduct } from "../../products.actions"
import { ProductEdit } from "./product-edit.server"

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    return (
      <PageContainer>
        <BackHeader href="/admin/product/products">Products</BackHeader>
        <FlexBetween>
            <h1>Edit Product</h1>
            <FromDeleteButton action={deleteProduct.bind(null, id)}>
                Delete Product
            </FromDeleteButton>
        </FlexBetween>
        <Suspense fallback={<FormSkeleton count={6} />}>
            <ProductEdit id={id} />
        </Suspense>
      </PageContainer>
    )
}