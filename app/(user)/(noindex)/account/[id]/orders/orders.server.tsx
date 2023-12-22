'use server'

import { getOrders } from "../../account.actions";
import { Orders } from "./orders.client";

export async function ServerOrdres({ id, page }: { id: number; page: number }) {
    const orders = await getOrders(id, page)
    return (
        <Orders orders={orders} customerId={id} />
    )
}