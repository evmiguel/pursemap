'use client'
import Link from "next/link";
import { useContext, useState } from "react";
import { FilterContext } from "@/app/filter-provider";
import { Purchase } from "@prisma/client";
import Analysis from "../Analysis";

type SidebarProps = {
    className: string,
    purchases: Array<Purchase>
}

export default function Sidebar(props: SidebarProps) {
    const { className, purchases } = props;
    const [active, setActive] = useState('week');

    const context = useContext(FilterContext);

    return (
        <ul className={className}>
            <li className={`inline-block md:block uppercase mb-2 ${active == 'week' && 'underline'}`}><Link href="#" onClick={() => { context.setPurchaseFilter('week'); setActive("week")}}>This week</Link></li>
            <li className={`inline-block md:block uppercase mb-2 ${active == 'month' && 'underline'}`}><Link href="#" onClick={() => { context.setPurchaseFilter('month'); setActive("month")}}>This month</Link></li>
            <li className={`inline-block md:block uppercase mb-2 ${active == 'year' && 'underline'}`}><Link href="#" onClick={() => { context.setPurchaseFilter('year'); setActive("year")}}>This year</Link></li>
            <li className={`inline-block md:block uppercase mb-2 ${active == 'all' && 'underline'}`}><Link href="#" onClick={() => { context.setPurchaseFilter('all'); setActive("all")}}>All</Link></li>
            <Analysis purchases={purchases} />
        </ul>
    )
}