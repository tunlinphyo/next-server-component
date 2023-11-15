import { FormSkeleton } from "@/components/admin/form/form.client";
import { BackHeader, FlexBetween, PageContainer } from "@/components/admin/utils/utils.client";
import { Suspense } from "react";
import { VariantEdit } from "./variant-edit.server";
import { getVariantPageLength } from "../../variant.action"
import { LinkButton } from "@/components/admin/button/button.client"
import { PlusIcon } from "@heroicons/react/24/outline"
import { TableSkeleton } from "@/components/admin/table/table.client"
import { PaginationSkileton } from "@/components/admin/pagination/pagination.client"
import { Pagination } from "@/components/admin/pagination/pagination.server"
import { ChildVariantList } from "../../variant.server"

export default async function Page({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams?: {
        page?: string;
        parent?: string;
    };
}) {
    const id = Number(params.id)
    const page = Number(searchParams?.page) ?? 1
    const parent = Number(searchParams?.parent)
    return (
        <PageContainer>
            <BackHeader />
            <FlexBetween>
                <h1>Edit Product Variant</h1>
            </FlexBetween>
            <Suspense key={id + page} fallback={<FormSkeleton count={2} />}>
                <VariantEdit id={id} page={page} />
            </Suspense>
            {
                !parent && <>
                    <FlexBetween>
                        <LinkButton href={`/admin/product/variants/${id}/create`} theme="primary">
                            Add Child Variant <PlusIcon />
                        </LinkButton>
                    </FlexBetween>
                    <Suspense key={page} fallback={<TableSkeleton cols={5} rows={5} />}>
                        <ChildVariantList id={id} page={page} />
                    </Suspense>
                    <Suspense fallback={<PaginationSkileton />}>
                        <Pagination action={getVariantPageLength.bind(null, id)} />
                    </Suspense>
                </>
            }
        </PageContainer>
    )
}
