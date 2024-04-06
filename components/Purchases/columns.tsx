"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import DeletePurchase from "../DeletePurchase";
import dayjs from 'dayjs';

export type Purchase = {
    id: bigint,
    name: string,
    email: string,
    date: Date,
    cost: number,
    category: string | null
}

export const columns: ColumnDef<Purchase>[] = [
    {
        
        accessorKey: "date",
        header: () => <div className="text-left">Date</div>,
        footer: 'Total',
        cell: ({ row }) => {
          return <div className="text-left font-medium">{dayjs(row.getValue('date')).format('MM/DD/YYYY')}</div>
        }
    },
    {
      accessorKey: "name",
      header: () => <div className="text-left">Name</div>,
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.getValue('name')}</div>
      }
    },
    {
        accessorKey: "category",
        header: () => <div className="text-center">Category</div>,
    },
    {
        accessorKey: "cost",
        header: ({ column }) => {
            return (
                <div className="text-right">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Cost
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )
          },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("cost"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)
    
            return <div className="text-right font-medium">{formatted}</div>
        },
        footer: ({ table }) => <div className="text-right">
            {   new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(
                table.getFilteredRowModel().rows.reduce((total, row) => total + parseFloat(row.getValue('cost')), 0))
            }
            </div>,
    },
    {
        id: "delete",
        cell: ({ row }) => {
            const purchase = row.original;

            return <DeletePurchase id={purchase.id} />
        }
    }
]