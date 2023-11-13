'use server'

import { PaginationClient } from "./pagination.client"

export async function Pagination({ action }: { action: () => Promise<number> }) {
    const totalPage = await action()
    return (
        <PaginationClient totalPages={totalPage} />
    )
}