

export interface UserType {
    id: number;
    name: string | null;
    email: string;
    password?: string;
    isDelete: boolean;
    isAdmin: boolean;
}

export interface VariantInterface {
    id: number;
    name: string;
    description: string;
    parent?: VariantInterface;
    children?: VariantInterface[];
    parentId?: number;
    createDate: Date;
    updateDate?: Date;
    isDelete: boolean; 
}