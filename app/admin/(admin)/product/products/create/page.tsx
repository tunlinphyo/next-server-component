import { FormSkeleton } from "@/components/admin/form/form.client";
import {
    BackHeader,
    FlexBetween,
    PageContainer,
} from "@/components/admin/utils/utils.client";
import { Suspense } from "react";
import { CreateProduct } from "./product-create.server";

export default function Page() {
    return (
        <PageContainer>
            <BackHeader>Products</BackHeader>
            <FlexBetween>
                <h1>Create Products</h1>
            </FlexBetween>
            <Suspense fallback={<FormSkeleton count={5} />}>
                <CreateProduct />
            </Suspense>
        </PageContainer>
    );
}
