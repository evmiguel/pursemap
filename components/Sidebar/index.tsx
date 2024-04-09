'use client'
import { FilterContext } from "@/app/filter-provider";
import Link from "next/link";
import { useContext } from "react";
import { Button } from "../ui/button";
import { Purchase } from "@prisma/client";
import { filterPurchases } from "../Purchases";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

type SidebarProps = {
    className: string,
    purchases: Array<Purchase>
}

export default function Sidebar(props: SidebarProps) {
    const { className, purchases } = props;

    const context = useContext(FilterContext);

    const filteredPurchases = filterPurchases(purchases, context.purchaseFilter).filter((value, index, self) => index === self.findIndex((p) => p.name === value.name));

    return (
        <ul className={className}>
            <li className="inline-block md:block uppercase underline mb-2"><Link href="#" onClick={() => context.setPurchaseFilter('week')}>This week</Link></li>
            <li className="inline-block md:block uppercase underline mb-2"><Link href="#" onClick={() => context.setPurchaseFilter('month')}>This month</Link></li>
            <li className="inline-block md:block uppercase underline mb-2"><Link href="#" onClick={() => context.setPurchaseFilter('year')}>This year</Link></li>
            <li className="inline-block md:block uppercase underline mb-2"><Link href="#" onClick={() => context.setPurchaseFilter('all')}>All</Link></li>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="Analyze">Analyze</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>This is what you&apos;ve accumulated {context.purchaseFilter === 'all' ? 'for all time' : `this ${context.purchaseFilter}`}</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="items">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="items">Items</TabsTrigger>
                            <TabsTrigger value="categories">Categories</TabsTrigger>
                        </TabsList>
                        <TabsContent value="items">
                            <ul>
                                {filteredPurchases.map(purchase => (
                                    <li key={purchase.id}>{purchase.name}</li>
                                ))}
                            </ul>
                        </TabsContent>
                        <TabsContent value="categories">
                            <div>
                                To be implemented
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </ul>
    )
}