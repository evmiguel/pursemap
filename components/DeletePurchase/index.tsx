'use client'

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

type DeleteProps = {
    id: bigint | undefined
}

// @ts-ignore
BigInt.prototype.toJSON = function() { return this.toString() }

export default function DeletePurchase({ id }: DeleteProps) {

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
    
    return (
        <Button className="bg-white text-red-400 hover:bg-white" onClick={async () => deletePurchase(id as bigint)}>
            <X />
        </Button>
    )
}