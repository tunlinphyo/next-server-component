import { CustomerAddress, CustomerPayment, Order, Payment } from "@prisma/client";


export interface OrderWithAddress extends Order {
    address: CustomerAddress;
}

export interface OrderWithPaymentAndAddress extends Order {
    address: CustomerAddress;
    customerPayment: CustomerPayment;
}

export interface CreditCard {
    customerId: number,
    paymentId: number,
    holderName: string,
    cardNumber: string,
    expYear: string,
    expMonth: string,
    cvc: string,
}

export interface CustomerPaymentWithPayment extends CustomerPayment {
    payment: Payment;
    card: CreditCard;
}