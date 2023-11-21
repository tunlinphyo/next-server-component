

export interface UserType {
    id: number;
    name: string | null;
    email: string;
    password?: string;
    isDelete: boolean;
    isAdmin: boolean;
}
