'use client'

import { FilterContext } from "@/app/filter-provider";
import { Purchase, columns } from "./columns";
import { DataTable } from "./data-table"
import dayjs from 'dayjs';
import { useContext } from "react";

interface PurchaseProps {
    purchases: Array<Purchase>
}

const filterPurchases = (purchases: Array<Purchase>, filter: string) => {
    switch (filter) {
        default: {
            return purchases;
        }
        case 'today': {
            return purchases.filter((purchase) => dayjs(purchase.date).isSame(Date.now(), 'day'));
        }
    }
}

export default function Purchases(props: PurchaseProps) {
    const { purchases } = props;

    const context = useContext(FilterContext);
        
    const filteredPurchases = filterPurchases(purchases, context.purchaseFilter as string);

    const sortedPurchases = filteredPurchases.sort((a, b) =>  new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <>
            <div className="container mx-auto text-center mb-10 mt-10">
                <DataTable columns={columns} data={sortedPurchases}  />
            </div>
        </>
    )
}
