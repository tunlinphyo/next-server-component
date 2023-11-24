

export interface UserType {
    id: number;
    name: string;
    email: string;
    isDelete: boolean;
    isAdmin: boolean;
    expiredAt: Date;
}

export interface CustomerType {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    isDelete: boolean;
    expiredAt: Date;
}
