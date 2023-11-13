'use client'

import { LinkIcon } from "@/components/admin/button/button.client";
import { FromDeleteButton } from "@/components/admin/form/form.client";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/components/admin/table/table.client";
import { VariantType } from "@/libs/definations";
import { formatDate } from "@/libs/utils";
import { PencilIcon } from "@heroicons/react/24/outline";
import { deleteVariant } from "./variant.action";
import { Budge } from "@/components/admin/utils/utils.client";

export function VariantTable({ variants, child }: { variants: VariantType[], child?: boolean }) {
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
                            <TableData>{ variant.id }</TableData>
                            <TableData>{ variant.name }</TableData>
                            <TableData>{ variant.description }</TableData>
                            <TableData>
                                {
                                    child
                                        ? (variant.parent_variant && variant.parent_variant.name)
                                        : <Budge>{ variant.child_count }</Budge>
                                }
                            </TableData>
                            <TableData>{ formatDate(variant.createDate) }</TableData>
                            <TableData end={true}>
                                <LinkIcon
                                    href={
                                        child
                                            ? `/admin/product/variants/${variant.id}/edit?parent=${variant.parent_variant_id}`
                                            : `/admin/product/variants/${variant.id}/edit`
                                    }
                                >
                                    <PencilIcon />
                                </LinkIcon>
                                <FromDeleteButton action={deleteVariant.bind(null, variant.id)} />
                            </TableData>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}