import { Key } from "react"

interface Purchase {
    id: bigint,
    name: string,
    email: string,
    cost: number,
    category: string | null
}

interface PurchaseProps {
    purchases: Array<Purchase>
}

export default function Purchases(props: PurchaseProps) {
    const { purchases } = props;
    return (
        <>
            <div className="container mx-auto text-center mb-60">
                <ul>
                    {
                        purchases.map(purchase => <li key={purchase.id} className="text-black">{purchase.name}</li>)
                    }
                </ul>
            </div>
        </>
    )
}
