import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Purchases from "@/components/Purchases";
import AddPurchase from "@/components/AddPurchase";

async function getPurchases(email: string) {
    const purchases = prisma.purchase.findMany({
        where: {
            email: email
        }
    });

    return purchases;
}

export default async function Page() {
    const session = await getServerSession();

    if (session === null) {
        redirect('/api/auth/signin');
    }

    const purchases = await getPurchases(session?.user?.email as string);

    return (
        <>
            <Purchases purchases={purchases} />
            <AddPurchase email={session?.user?.email} />
        </>
    )
}