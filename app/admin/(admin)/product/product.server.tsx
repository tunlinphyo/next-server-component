'use server'

import { SummaryCard } from "@/components/admin/card/card.client"
import { getTotalProductCategory, getTotalProductVariant, getTotalProducts } from "./product.actions"
import { CubeIcon, ListBulletIcon, TicketIcon } from "@heroicons/react/24/outline"

export async function ProductSummaryCard() {
    const count = await getTotalProducts()
    return (
        <SummaryCard
            title="Products"
            icon={<CubeIcon />}
            count={count}
            href="/admin/product/products"
        />
    )
}

export async function ProductVariantSummaryCard() {
    const count = await getTotalProductVariant()
    return (
        <SummaryCard
            title="Product Variants"
            icon={<ListBulletIcon />}
            count={count}
            href="/admin/product/variants"
        />
    )
}

export async function ProductCategorySummaryCard() {
    const count = await getTotalProductCategory()
    return (
        <SummaryCard
            title="Product Categories"
            icon={<TicketIcon />}
            count={count}
            href="/admin/product/categories"
        />
    )
}