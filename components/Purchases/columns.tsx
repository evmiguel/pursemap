"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import DeletePurchase from "../DeletePurchase"; 
import { Button } from "@/components/ui/button"
import dayjs from 'dayjs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import EditPurchase from "../EditPurchase";
import { Component } from "react";

export type Purchase = {
    id: bigint,
    userId: string,
    name: string,
    date: Date,
    cost: number,
    category: string | undefined
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
        id: "row_actions",
        cell: ({ table, row }) => {
            const purchase = row.original;

            return (
                <>
                <EditPurchase purchase={purchase} open={(table.options.meta as any).editComponentOpen} openOnChange={(table.options.meta as any).handleEditComponent} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => (table.options.meta as any).handleEditComponent(!(table.options.meta as any).editComponentOpen)}>
                            Edit Purchase
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </>
            )
            
        }
    }
]