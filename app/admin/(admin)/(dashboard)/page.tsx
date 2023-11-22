import { PageContainer } from "@/components/admin/utils/utils.client";
import { CategorySummary, CustomerSummary, LatestProducts, ProductSummary, VariantSummary } from "./dashboard.server";
import { DashboardSummary, DashboardSummarySkileton, ProductTableSkileton } from "./dashboard.client";
import { CubeIcon, ListBulletIcon, TicketIcon, UsersIcon } from "@heroicons/react/24/outline"
import { Suspense } from "react";

export default function Page() {
    return (
        <PageContainer>
            <h1>Dashboard</h1>
            <DashboardSummary>
                <Suspense fallback={<DashboardSummarySkileton icon={<CubeIcon />} title="Products" />}>
                    <ProductSummary />
                </Suspense>
                <Suspense fallback={<DashboardSummarySkileton icon={<TicketIcon />} title="Categories" />}>
                    <CategorySummary />
                </Suspense>
                <Suspense fallback={<DashboardSummarySkileton icon={<ListBulletIcon />} title="Variants" />}>
                    <VariantSummary />
                </Suspense>
                <Suspense fallback={<DashboardSummarySkileton icon={<UsersIcon />} title="Customers" />}>
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