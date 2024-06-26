'use client';

import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

const BreadcrumbDynamic = () => {
    const paths = usePathname();
    const pathNames = paths.split('/').filter(path => path);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {pathNames.map((link, index) => {
                    const href = `/${pathNames.slice(0, index + 1).join('/')}`;
                    const linkName = link.charAt(0).toUpperCase() + link.slice(1);
                    const isLastPath = pathNames.length === index + 1;

                    return (
                        <Fragment key={index}>
                            <BreadcrumbItem>
                                {!isLastPath ? (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{linkName}</Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{linkName}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                            {!isLastPath && <BreadcrumbSeparator />}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default BreadcrumbDynamic;
