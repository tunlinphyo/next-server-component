import { PageContainer } from "@/components/admin/utils/utils.client";
import { CategorySummary, CustomerSummary, LatestProducts, ProductSummary, VariantSummary } from "./(dashboard)/dashboard.server";
import { DashboardSummary, DashboardSummarySkileton, ProductTableSkileton } from "./(dashboard)/dashboard.client";
import { Suspense } from "react";

export default function Page() {
    return (
        <PageContainer>
            <h1>Dashboard</h1>
            <DashboardSummary>
                <Suspense fallback={<DashboardSummarySkileton />}>
                    <ProductSummary />
                </Suspense>
                <Suspense fallback={<DashboardSummarySkileton />}>
                    <CategorySummary />
                </Suspense>
                <Suspense fallback={<DashboardSummarySkileton />}>
                    <VariantSummary />
                </Suspense>
                <Suspense fallback={<DashboardSummarySkileton />}>
                    <CustomerSummary />
                </Suspense>
            </DashboardSummary>
            <h1>Recent Products</h1>
            <Suspense fallback={<ProductTableSkileton />}>
                <LatestProducts />
            </Suspense>

        </PageContainer>
    )
}