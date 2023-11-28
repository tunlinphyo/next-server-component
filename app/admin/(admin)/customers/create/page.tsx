import { BackHeader, PageContainer } from "@/components/admin/utils/utils.client"
import { CustomerCreate } from "./customer-create.server"
import { Suspense } from "react"
import { FormSkeleton } from "@/components/user/form/form.client"

export default function Page() {
    return (
      <PageContainer>
        <BackHeader />
        <h1>Create Customer</h1>
        <Suspense fallback={<FormSkeleton count={5} />}>
          <CustomerCreate />
        </Suspense>
      </PageContainer>
    )
}