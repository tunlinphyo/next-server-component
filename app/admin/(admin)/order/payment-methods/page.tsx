import { LinkButton } from "@/components/admin/button/button.client"
import {
  BackHeader,
  FlexBetween,
  PageContainer,
} from "@/components/admin/utils/utils.client"
import { Suspense } from "react"
import { PlusIcon } from "@heroicons/react/24/outline"
import { TableSkeleton } from "@/components/admin/table/table.client"
import { PayemntList } from "./payments.server";

export default async function Page() {
    return (
        <PageContainer>
            <BackHeader />
            <FlexBetween>
                <h1>Payment Methods</h1>
                <LinkButton href="/admin/order/payment-methods/create" theme="primary">
                    Add Payment <PlusIcon />
                </LinkButton>
            </FlexBetween>
            <Suspense fallback={<TableSkeleton cols={4} rows={5} />}>
                <PayemntList />
            </Suspense>
        </PageContainer>
    );
}
