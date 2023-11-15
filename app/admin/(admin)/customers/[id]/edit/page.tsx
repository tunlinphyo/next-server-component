import { BackHeader, FlexBetween, PageContainer } from "@/components/admin/utils/utils.client"
import { FormSkeleton, FromDeleteButton } from "@/components/admin/form/form.client"
import { deleteCustomer } from "../../customers.actions"
import { Suspense } from "react"
import { CustomerEdit } from "./customer-edit.server"

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    return (
      <PageContainer>
        <BackHeader />
        <FlexBetween>
            <h1>Edit Customer</h1>
            <FromDeleteButton action={deleteCustomer.bind(null, id)}>
                Delete Customer
            </FromDeleteButton>
        </FlexBetween>
        <Suspense fallback={<FormSkeleton count={5} />}>
            <CustomerEdit id={id} />
        </Suspense>
      </PageContainer>
    )
}