import { PageContainer } from "@/components/admin/utils/utils.client";
import { CategorySummary, CustomerSummary, ProductSummary, VariantSummary } from "./dashboard.server";
import { DashboardSummary, DashboardSummarySkileton } from "./dashboard.client";
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
            <div style={{ height: '300px', backgroundColor: 'rgb(var(--background-accent-rgb))', borderRadius: 'var(--space-2)' }} />
        </PageContainer>
    )
}