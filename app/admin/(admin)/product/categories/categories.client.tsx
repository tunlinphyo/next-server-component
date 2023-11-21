'use client'

import { LinkIcon } from "@/components/admin/button/button.client";
import { FromDeleteButton, IdContainer } from "@/components/admin/form/form.client";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/admin/table/table.client";
import { CategoryType } from "@/libs/definations";
import { formatDate } from "@/libs/utils";
import { PencilIcon } from "@heroicons/react/24/outline";
import { deleteCategory } from "./categories.actions";
import { Budge } from "@/components/admin/utils/utils.client";
import { CategoryWithParentAndChildCount } from "./categories.interface";

export function CategoryTable({ categories, child }: { categories: CategoryWithParentAndChildCount[], child?: boolean }) {
    return (
        <Table>
            <TableHeader>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                { child && <TableHead>Parent</TableHead>}
                <TableHead>Child</TableHead>
                <TableHead>Create Date</TableHead>
                <TableHead></TableHead>
            </TableHeader>
            <TableBody>
                {
                    categories.map(cate => (
                        <TableRow key={cate.id}>
                            <TableData>
                                <IdContainer id={cate.id} />    
                            </TableData>
                            <TableData>{ cate.name }</TableData>
                            { child && <TableData>{ cate.parent?.name }</TableData> }
                            <TableData>
                                <Budge>{ cate._count.children }</Budge>
                            </TableData>
                            <TableData>{ formatDate(cate.createDate) }</TableData>
                            <TableData end={true}>
                                <LinkIcon
                                    href={
                                        child
                                            ? `/admin/product/categories/${cate.id}/edit?parent=${cate.parent?.id}`
                                            : `/admin/product/categories/${cate.id}/edit`
                                    }
                                    theme="primary">
                                    <PencilIcon />
                                </LinkIcon>
                                <FromDeleteButton action={deleteCategory.bind(null, cate.id)} />
                            </TableData>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}