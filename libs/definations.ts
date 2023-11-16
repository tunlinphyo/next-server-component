export type Table = 'users' | 'customers' | 'products' | 'product_categories' | 'product_variants' | 'product_class'

export type GenericObject = Record<string, any>

export type NestedObject = {
    [key: string]: any;
}

export interface ChildrenProp {
    children: React.ReactNode;
}

export interface UserNavType {
    href: string;
    name: string;
    icon?: any;
}

export interface CookieCartType {
    id: number;
    quantity: number;
}

export interface FormArrayType {
    id: number;
    name: string;
}

export interface FormCategoryType {
    id: number;
    name: string;
    children?: FormCategoryType[];
}

export interface UserType {
    id: number;
    name: string;
    email: string;
    password: string;
    isDelete: boolean;
}

export interface CustomerType {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    password: string;
    createDate: Date;
    updateDate?: Date;
    isDelete: boolean;
}

export interface CategoryType {
    id: number;
    name: string;
    parent_category_id?: number;
    parent_category?: CategoryType;
    createDate: Date;
    updateDate?: Date;
    isDelete: boolean;
    child_count?: number;
    children?: CategoryType[];
}

export interface VariantType {
    id: number;
    name: string;
    description: string;
    parent_variant_id?: number;
    parent_variant?: VariantType;
    createDate: Date;
    updateDate?: Date;
    isDelete: boolean;
    child_count?: number;
}

export interface ProductType {
    id: number;
    name: string;
    description: string;
    images?: string[];
    price?: number;
    quantity?: number;
    minPrice?: number;
    maxPrice?: number;
    categories?: CategoryType[];
    category_ids?: number[];
    variant_1_id?: number;
    variant1?: VariantType;
    variant_2_id?: number;
    variant2?: VariantType;
    classes?: ProductClassType[];
    createDate: Date;
    updateDate?: Date;
    isDelete: boolean;
}

export interface ProductCategoryType {
    id: number;
    product_id: number;
    category_id: number;
    product?: ProductType;
    category?: CategoryType;
    createDate: Date;
    updateDate?: Date;
    isDelete: boolean;
}

export interface ProductClassType {
    id: number;
    product_id: number;
    variant_1_id?: number;
    variant_2_id?: number;
    price: number;
    quantity: number;
    product?: ProductType;
    variant1?: VariantType;
    variant2?: VariantType;
    createDate: Date;
    updateDate?: Date;
    isDelete: boolean;
}