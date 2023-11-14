import {
    BackHeader,
    FlexBetween,
    PageContainer,
} from "@/components/admin/utils/utils.client";
import { Suspense } from "react";
import { VariantSelect } from "./product-class.server";
import { TableSkeleton } from "@/components/admin/table/table.client";

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id);
    return (
        <PageContainer>
        <BackHeader href={`/admin/product/products/${id}/edit`}>
            Products
        </BackHeader>
        <FlexBetween>
            <h1>Edit Product Variant</h1>
        </FlexBetween>
        <Suspense fallback={<TableSkeleton cols={4} rows={4} />}>
            <VariantSelect id={id} />
        </Suspense>
        </PageContainer>
    );
}
