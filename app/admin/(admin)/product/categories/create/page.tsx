import { BackHeader, PageContainer } from "@/components/admin/utils/utils.client"
import { CreateCategory } from "./category-create.server"

export default async function Page() {
    return (
      <PageContainer>
        <BackHeader />
        <h1>Create Product Categories</h1>
        <CreateCategory />
      </PageContainer>
    )
}