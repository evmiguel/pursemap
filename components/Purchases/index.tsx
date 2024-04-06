import { Purchase, columns } from "./columns";
import { DataTable } from "./data-table"

interface PurchaseProps {
    purchases: Array<Purchase>
}

export default function Purchases(props: PurchaseProps) {
    const { purchases } = props;
    return (
        <>
            <div className="container mx-auto text-center mb-10 mt-10">
                <DataTable columns={columns} data={purchases}  />
            </div>
        </>
    )
}
