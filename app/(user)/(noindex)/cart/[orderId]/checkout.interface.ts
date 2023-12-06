import { CustomerAddress, CustomerPayment, Order, OrderItem, OrderStatus, Payment, Product, ProductClass, ProductImage, Variant } from "@prisma/client";


export interface OrderWithAddress extends Order {
    address: CustomerAddress;
}

export interface OrderWithPaymentAndAddress extends Order {
    address: CustomerAddress;
    customerPayment: CustomerPayment;
}

export interface OrderItemWidthDetail extends OrderItem {
    product: ProductWithDetail;
    productClass: ProductClassWithDetail;
    orderStatus: OrderStatus;
}

export interface ProductWithDetail extends Product {
    images: ProductImage[];
}

export interface ProductClassWithDetail extends ProductClass {
    variant1?: Variant;
    variant2?: Variant;
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