import { CustomerAddress, Order } from "@prisma/client";


export interface OrderWithAddress extends Order {
    address: CustomerAddress;
}