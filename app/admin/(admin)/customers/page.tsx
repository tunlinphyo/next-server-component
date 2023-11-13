import { LinkButton } from "@/components/admin/button/button.client";
import { FlexBetween } from "@/components/admin/utils/utils.client";
import { getCustomersPageLength } from "./customers.actions";
import { Suspense } from "react";
import { CustomerList } from "./customers.server";
import { TableSkeleton } from "@/components/admin/table/table.client";
import { Pagination } from '@/components/admin/pagination/pagination.server';
import { PageContainer } from '@/components/admin/utils/utils.client';
import { PlusIcon } from "@heroicons/react/24/outline";
import { PaginationSkileton } from "@/components/admin/pagination/pagination.client";

export default async function Page({ searchParams }: {
    searchParams?: {
        page?: string
    }
}) {
    const page = Number(searchParams?.page) ?? 1
    return (
        <PageContainer>
            <FlexBetween>
                <h1>Customers</h1>
                <LinkButton href="/admin/customers/create" theme="primary">
                    Create Customer
                    <PlusIcon />
                </LinkButton>
            </FlexBetween>
            <Suspense key={page} fallback={<TableSkeleton cols={4} rows={5} />}>
                <CustomerList page={page} />
            </Suspense>
            <Suspense fallback={<PaginationSkileton />}>
                <Pagination action={getCustomersPageLength} />
            </Suspense>
        </PageContainer>
    )
}