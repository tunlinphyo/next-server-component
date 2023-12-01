import { Summary, SummaryCardSkeleton } from "@/components/admin/card/card.client"
import { FlexBetween, PageContainer } from "@/components/admin/utils/utils.client"
import { Suspense } from "react"
import { OrdersSummaryCard, PaymentSummaryCard } from "./order.server"

export default function Page() {
  return (
    <PageContainer>
      <FlexBetween>
        <h1>Product</h1>
      </FlexBetween>
      <Summary>
        <Suspense fallback={<SummaryCardSkeleton />}>
          <PaymentSummaryCard />
        </Suspense>
        <Suspense fallback={<SummaryCardSkeleton />}>
          <OrdersSummaryCard />
        </Suspense>
      </Summary>
    </PageContainer>
  )
}