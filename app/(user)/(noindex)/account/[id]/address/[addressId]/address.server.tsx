'use server'

import prisma from "@/libs/prisma";
import { CustomerAddress } from "@prisma/client";
import { AddressEditForm } from "./address.client";

export async function AddressEdit({ customerId, addressId }: { customerId: number; addressId: string }) {
    console.log(customerId, addressId)
    let address: CustomerAddress | null = null
    if (addressId !== 'new') {
        address = await prisma.customerAddress.findUnique({
            where: { id: Number(addressId), customerId }
        })
    }
    return (
        <AddressEditForm customerId={customerId} address={address} />
    )
}