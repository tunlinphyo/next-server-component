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
import { SearchBar, SearchContainer } from "@/components/admin/search/search.client";

export default async function Page({ searchParams }: {
    searchParams?: {
        page?: string;
        query?: string;
    }
}) {
    const page = Number(searchParams?.page) ?? 1
    const query = searchParams?.query || ''
    return (
        <PageContainer>
            <FlexBetween>
                <h1>Customers</h1>
                <LinkButton href="/admin/customers/create" theme="primary">
                    Add Customer
                    <PlusIcon />
                </LinkButton>
            </FlexBetween>
            <SearchContainer>
                <SearchBar placehiolder="Search by customer name and email.." />
            </SearchContainer>
            <Suspense key={page + query} fallback={<TableSkeleton cols={4} rows={5} />}>
                <CustomerList page={page} query={query} />
            </Suspense>
            <Suspense fallback={<PaginationSkileton />}>
                <Pagination action={getCustomersPageLength.bind(null, query)} />
            </Suspense>
        </PageContainer>
    )
}