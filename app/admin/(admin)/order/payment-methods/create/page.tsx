import { BackHeader, PageContainer } from "@/components/admin/utils/utils.client"
import { Suspense } from "react"
import { FormSkeleton } from "@/components/user/form/form.client"
import { PaymentCreateForm } from "./payment-create.client"

export default function Page() {
    return (
      <PageContainer>
        <BackHeader />
        <h1>Create Payment</h1>
        <Suspense fallback={<FormSkeleton count={5} />}>
          <PaymentCreateForm />
        </Suspense>
      </PageContainer>
    )
}