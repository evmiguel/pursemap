'use client'
import Link from "next/link";
import { useContext } from "react";
import { FilterContext } from "@/app/filter-provider";
import { Purchase } from "@prisma/client";
import Analysis from "../Analysis";

type SidebarProps = {
    className: string,
    purchases: Array<Purchase>
}

export default function Sidebar(props: SidebarProps) {
    const { className, purchases } = props;

    const context = useContext(FilterContext);

    return (
        <ul className={className}>
            <li className="inline-block md:block uppercase underline mb-2"><Link href="#" onClick={() => context.setPurchaseFilter('week')}>This week</Link></li>
            <li className="inline-block md:block uppercase underline mb-2"><Link href="#" onClick={() => context.setPurchaseFilter('month')}>This month</Link></li>
            <li className="inline-block md:block uppercase underline mb-2"><Link href="#" onClick={() => context.setPurchaseFilter('year')}>This year</Link></li>
            <li className="inline-block md:block uppercase underline mb-2"><Link href="#" onClick={() => context.setPurchaseFilter('all')}>All</Link></li>
            <Analysis purchases={purchases} />
        </ul>
    )
}