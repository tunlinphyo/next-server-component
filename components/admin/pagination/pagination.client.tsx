"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { generatePagination } from "./pagination.util";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./pagination.module.css";

export function PaginationClient({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const allPages = generatePagination(currentPage, totalPages);

    if (!allPages.length) return <></>

    return (
        <div className={styles.pagiantion}>
            <PaginationArrow
                direction="left"
                href={createPageURL(currentPage - 1)}
                isDisabled={currentPage <= 1}
            />

            <div className={styles.numbers}>
                {allPages.map((page: number | string, index: number) => {
                    let position: "first" | "last" | "single" | "middle" | undefined;

                    if (index === 0) position = "first";
                    if (index === allPages.length - 1) position = "last";
                    if (allPages.length === 1) position = "single";
                    if (page === "...") position = "middle";

                    return (
                    <PaginationNumber
                        key={`${page}-${index}`}
                        href={createPageURL(page)}
                        page={page}
                        position={position}
                        isActive={currentPage === page}
                    />
                    );
                })}
            </div>

            <PaginationArrow
                direction="right"
                href={createPageURL(currentPage + 1)}
                isDisabled={currentPage >= totalPages}
            />
        </div>
    );
}

export function PaginationSkileton() {
    return (
        <div className={styles.pagiantion}>
            <PaginationArrow
                direction="left"
                href="#"
                isDisabled={true}
            />

            <div className={styles.numbers}>
                <div className={clsx(styles.paginationNumber, styles.roundLeft)} />
                <div className={clsx(styles.paginationNumber)} />
                <div className={clsx(styles.paginationNumber, styles.roundRight)} />
            </div>

            <PaginationArrow
                direction="right"
                href="#"
                isDisabled={true}
            />
        </div>
    )
}

function PaginationNumber({
    page,
    href,
    isActive,
    position,
}: {
    page: number | string;
    href: string;
    position?: "first" | "last" | "middle" | "single";
    isActive: boolean;
}) {
    const className = clsx(
        styles.paginationNumber,
        (position === "first" || position === "single") && styles.roundLeft,
        (position === "last" || position === "single") && styles.roundRight,
        isActive && styles.active,
        position === "middle" && styles.middle
    );

    return isActive || position === "middle" ? (
        <div className={className}>{page}</div>
    ) : (
        <Link href={href} className={className}>
        {page}
        </Link>
    );
}

function PaginationArrow({
    href,
    direction,
    isDisabled,
}: {
    href: string;
    direction: "left" | "right";
    isDisabled?: boolean;
}) {
    const className = clsx(
        styles.paginationNumber,
        styles.paginationArrow,
        isDisabled && styles.disabled
    );

    const icon =
        direction === "left" ? (
        <ArrowLeftIcon className={clsx(styles.arrow)} />
        ) : (
        <ArrowRightIcon className={clsx(styles.arrow)} />
        );

    return isDisabled ? (
        <div className={className}>{icon}</div>
    ) : (
        <Link className={className} href={href}>
        {icon}
        </Link>
    );
}
