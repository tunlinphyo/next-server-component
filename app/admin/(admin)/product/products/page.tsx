import { LinkButton } from "@/components/admin/button/button.client"
import { PaginationSkileton } from "@/components/admin/pagination/pagination.client";
import { Pagination } from "@/components/admin/pagination/pagination.server";
import { BackHeader, FlexBetween, PageContainer } from "@/components/admin/utils/utils.client"
import { PlusIcon } from "@heroicons/react/24/outline"
import { Suspense } from "react";
import { getProductPageLength } from "./products.actions";
import { TableSkeleton } from "@/components/admin/table/table.client";
import { ProductList } from "./products.server";
import { SearchBar, SearchContainer } from "@/components/admin/search/search.client";

type PageProps = {
    searchParams?: {
        page?: string;
        query?: string;
    }
}

export default function Page({ searchParams }:  PageProps) {
    const query = searchParams?.query || ''
    const page = Number(searchParams?.page) ?? 1
    return (
        <PageContainer>
            <BackHeader />
            <FlexBetween>
                <h1>Products</h1>
                <LinkButton href="/admin/product/products/create" theme="primary">
                    Add Product <PlusIcon />
                </LinkButton>
            </FlexBetween>
            <SearchContainer>
                <SearchBar placehiolder="Search products..." />
            </SearchContainer>
            <Suspense key={page + query} fallback={<TableSkeleton cols={5} rows={5} />}>
                <ProductList page={page} query={query} />
            </Suspense>
            <Suspense fallback={<PaginationSkileton />}>
                <Pagination action={getProductPageLength.bind(null, query)} />
            </Suspense>
        </PageContainer>
    )
}