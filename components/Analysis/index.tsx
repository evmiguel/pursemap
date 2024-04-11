'use client';

import { Button } from "../ui/button";
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
import { useContext, useMemo } from "react";
import { FilterContext } from "@/app/filter-provider";
import { filterPurchases } from "../Purchases";
import { Purchase } from "../Purchases/columns";
import { formatCurrency } from "@/util";

type AnalysisProps = {
    purchases: Array<Purchase>
}

const sumByKey = (arr: Array<any>, key: string, value: string) => {
    const map = new Map();
    for(const obj of arr) {
      const currSum = map.get(obj[key]) || 0;
      map.set(obj[key], currSum + obj[value]);
    }
    const res = Array.from(map, ([k, v]) => ({[key]: k, [value]: v}));
    return res;
}


export default function Analysis({ purchases }: AnalysisProps) {
    const context = useContext(FilterContext);

    const filteredPurchases = filterPurchases(purchases, context.purchaseFilter);

    const itemsBought = sumByKey(filteredPurchases, 'name', 'cost').sort((a, b) => b.cost - a.cost);

    const purchasesByCategory = filteredPurchases.reduce((a, b) => { 
      if ( !(b.category as string in a) ) {
        a[b.category as string] = [];
      }
      a[b.category as string].push(b)
      return a
    }, {} as Record<string, any>)
 
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="Analyze">Analyze</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1000px] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>This is what you&apos;ve accumulated {context.purchaseFilter === 'all' ? 'for all time' : `this ${context.purchaseFilter}`}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="items">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="items">Items</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                    </TabsList>
                    <TabsContent value="items" className="overflow-scroll max-h-96">
                        <div>
                          <ul>
                              {itemsBought.map(purchase => (
                                  <li className="flex justify-between" key={purchase.name}><span className="inline-block">{purchase.name}</span> <span className="inline-block">{formatCurrency(purchase.cost)}</span></li>
                              ))}
                              <li className="flex justify-between border-t-2" key="total"><span className="inline-block font-bold">Total</span><span className="inline-block font-bold">
                                {
                                  formatCurrency(itemsBought.reduce((a, b) => { return b.cost + a },0))
                                }
                                </span></li>
                          </ul>
                        </div>
                    </TabsContent>
                    <TabsContent value="categories">
                        <div>
                          <ul>
                              {
                                Object.entries(purchasesByCategory).map(([category, purchases]) => {
                                  const cost = purchases.reduce((a: number, b: Purchase) => { return b.cost + a }, 0);
                                  return <li className="flex justify-between" key={category}>
                                    <span className="inline-block">{category}</span>
                                    <span className="inline-block">{formatCurrency(cost)}</span>
                                    </li>
                                })
                              }
                              <li className="flex justify-between border-t-2" key="total"><span className="inline-block font-bold">Total</span><span className="inline-block font-bold">
                                {
                                  formatCurrency(Object.values(purchasesByCategory).reduce((a, purchases) => {
                                    const rowCost = purchases.reduce((a: number, b: Purchase) => { return b.cost + a }, 0);
                                    return rowCost + a;
                                  }, 0))
                                }
                                </span></li>
                          </ul>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}