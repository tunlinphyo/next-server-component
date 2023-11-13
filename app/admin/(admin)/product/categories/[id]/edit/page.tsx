import { FormSkeleton } from "@/components/admin/form/form.client"
import { BackHeader, FlexBetween, PageContainer } from "@/components/admin/utils/utils.client"
import { Suspense } from "react"
import { CategoryEdit } from "./category-edit.server"
import { LinkButton } from "@/components/admin/button/button.client"
import { PlusIcon } from "@heroicons/react/24/outline"
import { PaginationSkileton } from "@/components/admin/pagination/pagination.client"
import { Pagination } from '@/components/admin/pagination/pagination.server';
import { TableSkeleton } from "@/components/admin/table/table.client";
import { ChildCategoryList } from "../../categories.server";
import { getCategoryPageLength } from "../../categories.actions"

export default async function Page({ params, searchParams }: { 
    params: { id: string },
    searchParams?: {
        page?: string;
        parent?: string;
    }
}) {
    const id = Number(params.id)
    const page = searchParams?.page ? Number(searchParams?.page) : 1
    const parent = Number(searchParams?.parent)
    return (
        <PageContainer>
            {
                parent 
                    ? <BackHeader href={`/admin/product/categories/${parent}/edit`}>Edit Product Categories</BackHeader>
                    : <BackHeader href={`/admin/product/categories`}>Product Categories</BackHeader>
            }
            <FlexBetween>
                <h1>Edit Product Category</h1>
            </FlexBetween>
            <Suspense key={id + page} fallback={<FormSkeleton count={1} />}>
                <CategoryEdit id={id} />
            </Suspense>
            {/* {
                !parent && <> */}
                    <FlexBetween>
                        <LinkButton href={`/admin/product/categories/${id}/create`} theme="primary">
                            Create Category <PlusIcon />
                        </LinkButton>
                    </FlexBetween>
                    <Suspense key={page} fallback={<TableSkeleton cols={4} rows={5} />}>
                        <ChildCategoryList id={id} page={page} />
                    </Suspense>
                    <Suspense fallback={<PaginationSkileton />}>
                        <Pagination action={getCategoryPageLength.bind(null, id)} />
                    </Suspense>
                {/* </>
            } */}
        </PageContainer>
    )
}