import { LinkButton } from "@/components/admin/button/button.client";
import { TableSkeleton } from "@/components/admin/table/table.client";
import {
    BackHeader,
    FlexBetween,
    PageContainer,
} from "@/components/admin/utils/utils.client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Suspense } from "react";
import { VariantList } from "./variant.server";
import { PaginationSkileton } from "@/components/admin/pagination/pagination.client";
import { Pagination } from "@/components/admin/pagination/pagination.server";
import { getVariantPageLength } from "./variant.action";

export default function Page({
    searchParams,
}: {
    searchParams?: {
        page?: string;
    };
}) {
    const page = Number(searchParams?.page) ?? 1;
    return (
        <PageContainer>
            <BackHeader />
            <FlexBetween>
                <h1>Product Variants</h1>
                <LinkButton href="/admin/product/variants/create" theme="primary">
                    Add Variant <PlusIcon />
                </LinkButton>
            </FlexBetween>
            <Suspense key={page} fallback={<TableSkeleton cols={6} rows={5} />}>
                <VariantList page={page} />
            </Suspense>
            <Suspense fallback={<PaginationSkileton />}>
                <Pagination action={getVariantPageLength} />
            </Suspense>
        </PageContainer>
    );
}
