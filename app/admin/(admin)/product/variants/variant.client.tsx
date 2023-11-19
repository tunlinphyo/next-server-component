'use client'

import { LinkIcon } from "@/components/admin/button/button.client";
import { FromDeleteButton, IdContainer } from "@/components/admin/form/form.client";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/admin/table/table.client";
import { formatDate } from "@/libs/utils";
import { PencilIcon } from "@heroicons/react/24/outline";
import { deleteVariant } from "./variant.action";
import { Budge } from "@/components/admin/utils/utils.client";
import { VariantInterface } from "@/libs/prisma/definations";
import { usePathname } from "next/navigation";

export function VariantTable({ variants, child }: { variants: VariantInterface[], child?: boolean }) {
    const pathname = usePathname()
    return (
        <Table>
            <TableHeader>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>{ child ? 'Parent' : 'Child' }</TableHead>
                <TableHead>Create Date</TableHead>
                <TableHead></TableHead>
            </TableHeader>
            <TableBody>
                {
                    variants.map(variant => (
                        <TableRow key={variant.id}>
                            <TableData>
                                <IdContainer id={variant.id} />
                            </TableData>
                            <TableData>{ variant.name }</TableData>
                            <TableData>{ variant.description }</TableData>
                            <TableData>
                                {
                                    child
                                        ? (variant.parent && variant.parent.name)
                                        : <Budge>{ variant.children?.length }</Budge>
                                }
                            </TableData>
                            <TableData>{ formatDate(variant.createDate) }</TableData>
                            <TableData end={true}>
                                <LinkIcon
                                    href={
                                        child
                                            ? `/admin/product/variants/${variant.id}/edit?parent=${variant.parentId}`
                                            : `/admin/product/variants/${variant.id}/edit`
                                    }
                                    theme="primary"
                                >
                                    <PencilIcon />
                                </LinkIcon>
                                <FromDeleteButton action={deleteVariant.bind(null, variant.id, pathname)} />
                            </TableData>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}