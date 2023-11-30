"use server"

import { getUser } from "@/app/(user)/user.actions"
import { redirect } from "next/navigation"
import { getAllCustomerAddress, getOrder } from "../checkout.actions"
import { AddressInput, ShippingForm } from './shipping.client';
import { Suspense } from "react";
import { wait } from "@/libs/utils";
import { InputSkeleton } from "@/components/user/form/form.client";

export async function ServerShipping({ orderId }: { orderId: number }) {
    await wait()
    const user = await getUser()
    if (!user) return('/')
    const order = await getOrder(orderId, user?.id)
    if (!order) redirect('cart')

    return (
        <ShippingForm order={order} customer={user}>
            <Suspense fallback={<InputSkeleton />}>
                <ServerAddress customerId={user.id} addressId={order.addressId} />
            </Suspense>
        </ShippingForm>
    )
}

export async function ServerAddress({ customerId, addressId }: { customerId: number; addressId?: number | null; }) {
    await wait()
    const addressList = await getAllCustomerAddress(customerId)
    return (
        <AddressInput customerId={customerId} addressId={addressId} addrList={addressList} />
    )
}