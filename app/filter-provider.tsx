'use client'
 
import { createContext, useState } from 'react'
 
export const FilterContext = createContext({ purchaseFilter: 'today', setPurchaseFilter: (_: string) => {} });
 
export default function FilterProvider({
  children,
}: {
  children: React.ReactNode
}) {

    const setPurchaseFilter = ((purchaseFilter: string) => {
        setFilter({
            purchaseFilter,
            setPurchaseFilter
        })
    });

    const [filter, setFilter] = useState({
        purchaseFilter: 'week',
        setPurchaseFilter
    });

    return <FilterContext.Provider value={{ purchaseFilter: filter.purchaseFilter, setPurchaseFilter }}>{children}</FilterContext.Provider>
}