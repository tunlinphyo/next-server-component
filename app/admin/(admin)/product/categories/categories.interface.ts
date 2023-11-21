import { Category } from "@prisma/client"

export interface CategoryWithParent extends Category {
    parent?: {
        id: number;
        name: string;
    };
}

export interface CategoryWithParentAndChildCount extends CategoryWithParent, Category {
    _count: {
        children: number;
    }
}

export interface CategoryChildRecursive extends Category {
    children: CategoryChildRecursive[]
}