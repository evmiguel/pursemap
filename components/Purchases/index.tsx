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
            <ul>
                {
                    purchases.map(purchase => <li key={purchase.id}>{purchase.name}</li>)
                }
            </ul>
        </>
    )
}
