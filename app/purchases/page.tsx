import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Purchases from "@/components/Purchases";
import AddPurchase from "@/components/AddPurchase";
import Sidebar from "@/components/Sidebar";
import FilterProvider from "../filter-provider";

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
        <div className="h-screen bg-white md:grid md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9">
            <FilterProvider>
                <main className="mb-8 md:col-span-4 lg:col-span-6 xl:col-span-8">
                    <Purchases purchases={purchases} />
                    <AddPurchase email={session?.user?.email} />
                </main>
                <Sidebar className={"flex space-x-4 pr-10 justify-center w-screenm md:space-x-0 md:block md:w-50 md:col-span-1 md:mt-10 md:mr-10 md:text-right"} />
            </FilterProvider>
        </div>
    )
}