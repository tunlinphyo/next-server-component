import { LinkButton } from "@/components/admin/button/button.client"
import { PaginationSkileton } from "@/components/admin/pagination/pagination.client";
import { Pagination } from "@/components/admin/pagination/pagination.server";
import { BackHeader, FlexBetween, PageContainer } from "@/components/admin/utils/utils.client"
import { PlusIcon } from "@heroicons/react/24/outline"
import { Suspense } from "react";
import { getProductPageLength } from "./products.actions";
import { TableSkeleton } from "@/components/admin/table/table.client";
import { ProductList } from "./products.server";

export default function Page({
    searchParams,
}: {
    searchParams?: {
        page?: string;
    };
}) {
    const page = Number(searchParams?.page) ?? 1
    return (
        <PageContainer>
            <BackHeader href="/admin/product">Product</BackHeader>
            <FlexBetween>
                <h1>Products</h1>
                <LinkButton href="/admin/product/products/create" theme="primary">
                    Create Product <PlusIcon />
                </LinkButton>
            </FlexBetween>
            <Suspense key={page} fallback={<TableSkeleton cols={5} rows={5} />}>
                <ProductList page={page} />
            </Suspense>
            <Suspense fallback={<PaginationSkileton />}>
                <Pagination action={getProductPageLength} />
            </Suspense>
        </PageContainer>
    )
}