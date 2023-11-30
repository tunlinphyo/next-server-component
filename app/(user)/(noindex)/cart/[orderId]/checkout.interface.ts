import { CustomerAddress, Order, OrderPayment } from "@prisma/client";


export interface OrderWithAddress extends Order {
    address: CustomerAddress;
}

export interface OrderWithPaymentAndAddress extends Order {
    address: CustomerAddress;
    orderPayment: OrderPayment;
}