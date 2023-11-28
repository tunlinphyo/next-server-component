import { Customer, Status } from "@prisma/client";

export interface CustomerWithStatus extends Customer {
    status: Status;
}