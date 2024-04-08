'use client'

import { FilterContext } from "@/app/filter-provider";
import { Purchase, columns } from "./columns";
import { DataTable } from "./data-table"
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek'
import * as _ from "lodash";
import { useContext, useState } from "react";

dayjs.extend(isoWeek);

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
        case 'week': {
            const purchasesThisYear = purchases.filter((purchase) => dayjs(purchase.date).isSame(Date.now(), 'year'));
            const purchasesByWeek = _.groupBy(purchasesThisYear, (dt) => dayjs(dt.date).isoWeek());
            const thisWeek = Math.max(...(Object.keys(purchasesByWeek).map(key => parseInt(key))));
            return purchasesByWeek[thisWeek.toString()] || [];
        }
        case 'month': {
            return purchases.filter((purchase) => dayjs(purchase.date).isSame(Date.now(), 'month'))
        }
        case 'year': {
            return purchases.filter((purchase) => dayjs(purchase.date).isSame(Date.now(), 'year'))
        }
    }
}

export default function Purchases(props: PurchaseProps) {
    const [editComponentOpen, setEditComponentOpen] = useState(false);

    const { purchases } = props;

    const context = useContext(FilterContext);
        
    const filteredPurchases = filterPurchases(purchases, context.purchaseFilter);

    const sortedPurchases = filteredPurchases.sort((a, b) =>  new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <>
            <div className="container mx-auto text-center mb-10 mt-10">
                <DataTable columns={columns} data={sortedPurchases} editComponentOpen={editComponentOpen} handleEditComponent={setEditComponentOpen}  />
            </div>
        </>
    )
}
