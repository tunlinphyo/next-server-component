import { Summary, SummaryCardSkeleton } from "@/components/admin/card/card.client"
import { FlexBetween, PageContainer } from "@/components/admin/utils/utils.client"
import { Suspense } from "react"
import { ProductCategorySummaryCard, ProductSummaryCard, ProductVariantSummaryCard } from "./product.server"

export default function Page() {
  return (
    <PageContainer>
      <FlexBetween>
        <h1>Product</h1>
      </FlexBetween>
      <Summary>
        <Suspense fallback={<SummaryCardSkeleton />}>
          <ProductCategorySummaryCard />
        </Suspense>
        <Suspense fallback={<SummaryCardSkeleton />}>
          <ProductVariantSummaryCard />
        </Suspense>
        <Suspense fallback={<SummaryCardSkeleton />}>
          <ProductSummaryCard />
        </Suspense>
      </Summary>
    </PageContainer>
  )
}