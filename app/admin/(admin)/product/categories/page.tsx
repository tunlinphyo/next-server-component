import { LinkButton } from "@/components/admin/button/button.client";
import {
  BackHeader,
  FlexBetween,
  PageContainer,
} from "@/components/admin/utils/utils.client";
import { Suspense } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Pagination } from "@/components/admin/pagination/pagination.server";
import { TableSkeleton } from "@/components/admin/table/table.client";
import { getCategoryPageLength } from "./categories.actions";
import { CategoryList } from "./categories.server";
import { PaginationSkileton } from "@/components/admin/pagination/pagination.client";

export default async function Page({
    searchParams,
}: {
    searchParams?: {
        page?: string;
    };
}) {
    const page = Number(searchParams?.page) ?? 1
    return (
        <PageContainer>
            <BackHeader />
            <FlexBetween>
                <h1>Product categories</h1>
                <LinkButton href="/admin/product/categories/create" theme="primary">
                    Add Category <PlusIcon />
                </LinkButton>
            </FlexBetween>
            <Suspense key={page} fallback={<TableSkeleton cols={4} rows={5} />}>
                <CategoryList page={page} />
            </Suspense>
            <Suspense fallback={<PaginationSkileton />}>
                <Pagination action={getCategoryPageLength} />
            </Suspense>
        </PageContainer>
    );
}
