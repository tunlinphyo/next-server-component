import { BackHeader, PageContainer } from "@/components/admin/utils/utils.client"
import { CreateVariant } from "./variant-create.server"


export default async function Page() {
    return (
      <PageContainer>
            <BackHeader />
            <h1>Create Product Variants</h1>
            <CreateVariant />
      </PageContainer>
    )
}