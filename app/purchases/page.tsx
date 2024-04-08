import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Purchases from "@/components/Purchases";
import AddPurchase from "@/components/AddPurchase";
import Sidebar from "@/components/Sidebar";
import FilterProvider from "../filter-provider";
import { authOptions } from "../api/auth/[...nextauth]/options";

async function getPurchases(email: string) {
    const user = await prisma.user.findFirst(
        {
            where: {
                email
            },
            include: {
                purchases: true
            }
        }
    );

    return user?.purchases;
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (session === null) {
        redirect('/api/auth/signin');
    }

    const purchases = await getPurchases(session?.user?.email as string) || [];
    
    return (
        <div className="h-screen bg-white md:grid md:grid-cols-5 md:grid-flow-dense lg:grid-cols-7 xl:grid-cols-9">
            <Sidebar className={"flex space-x-4 pt-10 justify-center md:order-2 md:space-x-0 md:block md:w-50 md:col-span-1 md:mt-10 md:mr-10 md:text-right"} />
            <main className="mb-8 md:col-span-4 md:order-1 lg:col-span-6 xl:col-span-8">
                <Purchases purchases={purchases} />
                <AddPurchase />
            </main>
        </div>
    )
}