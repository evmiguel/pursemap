'use client'

import { FilterContext } from "@/app/filter-provider";
import { Purchase, columns } from "./columns";
import { DataTable } from "./data-table"
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek'
import * as _ from "lodash";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import EditPurchase from "../EditPurchase";

dayjs.extend(isoWeek);

// @ts-ignore
BigInt.prototype.toJSON = function() { return this.toString() }

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

    const router = useRouter();

    async function deletePurchase(id: bigint) {
        const data = {
            id
        }
    
        try {
            await fetch('/api/purchase', { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    }

    const [editComponentOpen, setEditComponentOpen] = useState(false);
    const [currentPurchase, setCurrentPurchase] = useState({} as Purchase);

    const { purchases } = props;

    const context = useContext(FilterContext);
        
    const filteredPurchases = filterPurchases(purchases, context.purchaseFilter);

    const sortedPurchases = filteredPurchases.sort((a, b) =>  new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
        <>
            <div className="container mx-auto text-center mb-10 mt-10">
                <DataTable 
                    columns={columns} 
                    data={sortedPurchases} 
                    editComponentOpen={editComponentOpen} 
                    handleEditComponent={setEditComponentOpen}
                    deletePurchase={deletePurchase}
                    setCurrentPurchase={setCurrentPurchase}
                />
                <EditPurchase purchase={currentPurchase} open={editComponentOpen} openOnChange={setEditComponentOpen} />
            </div>
        </>
    )
}
