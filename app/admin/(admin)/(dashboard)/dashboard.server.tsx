'use server'

import { CubeIcon, ListBulletIcon, TicketIcon, UsersIcon } from "@heroicons/react/24/outline"
import { DashboardSummaryCard, ProductTable } from "./dashboard.client"
import { getTotalProductCategory, getTotalProductVariant, getTotalProducts } from "../product/product.actions"
import { getTotalCustomer } from "../customers/customers.actions"
import { getLatestProducts } from "./dashboard.actions"

export async function ProductSummary() {
    const count = await getTotalProducts()
    return (
        <DashboardSummaryCard
            icon={<CubeIcon />}
            title="Products"
        >{ count }</DashboardSummaryCard>
    )
}

export async function CategorySummary() {
    const count = await getTotalProductCategory()
    return (
        <DashboardSummaryCard
            icon={<TicketIcon />}
            title="Categories"
        >{ count }</DashboardSummaryCard>
    )
}

export async function VariantSummary() {
    const count = await getTotalProductVariant()
    return (
        <DashboardSummaryCard
            icon={<ListBulletIcon />}
            title="Variants"
        >{ count }</DashboardSummaryCard>
    )
}

export async function CustomerSummary() {
    const count = await getTotalCustomer()
    return (
        <DashboardSummaryCard
            icon={<UsersIcon />}
            title="Customers"
        >{ count }</DashboardSummaryCard>
    )
}

export async function LatestProducts() {
    const { lastDate, products } = await getLatestProducts()
    return (
        <ProductTable lastDate={lastDate || new Date()} products={products} />
    )
}