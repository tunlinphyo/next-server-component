import { Variant } from "@prisma/client"

export interface VariantCount {
    _count: {
        id: number;
    };
}

export interface VariantWithChildCount extends Variant {
    _count: {
        children: number;
    };
}

export interface VariantWithParent extends Variant {
    parent?: {
        id: number;
        name: string;
    };
}

export interface VariantWithParentAndChildCount extends VariantWithParent, VariantWithChildCount {}
