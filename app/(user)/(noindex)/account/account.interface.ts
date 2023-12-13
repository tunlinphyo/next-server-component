import { Customer, CustomerAddress, Order, OrderStatus, Status } from "@prisma/client";
import { CustomerPaymentWithPayment } from '../cart/[orderId]/checkout.interface';


export interface CustomerEdit extends Customer {
    status: Status;
    address: CustomerAddress[];
}

export interface OrderWithPayemntAndStatus extends Order {
    customerPayment: CustomerPaymentWithPayment;
    orderStatus: OrderStatus;
}