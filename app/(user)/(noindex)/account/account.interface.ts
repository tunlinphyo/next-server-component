import { Customer, CustomerAddress, Status } from "@prisma/client";


export interface CustomerEdit extends Customer {
    status: Status;
    address: CustomerAddress[];
}