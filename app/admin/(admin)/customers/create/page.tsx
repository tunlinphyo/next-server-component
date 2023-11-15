import { BackHeader, PageContainer } from "@/components/admin/utils/utils.client"
import { CustomerCreateForm } from "./customer-create.client"

export default function Page() {
    return (
      <PageContainer>
        <BackHeader />
        <h1>Create Customer</h1>
        <CustomerCreateForm />
      </PageContainer>
    )
}