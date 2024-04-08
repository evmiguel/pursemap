import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Purchases from "@/components/Purchases";
import AddPurchase from "@/components/AddPurchase";
import Sidebar from "@/components/Sidebar";
import FilterProvider from "../filter-provider";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { plaidClient, sessionOptions } from "@/lib/plaid";
import { SessionData } from "../api/plaid/exchange-public-token/route";
import { TransactionsGetRequest } from "plaid";

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

async function getTransactions() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    const accessToken = session.access_token;
  
    if (!accessToken) {
        return [];
    }
  
    const request: TransactionsGetRequest = {
        access_token: accessToken,
        start_date: '2018-01-01',
        end_date: '2024-04-07'
    };

    try {
        const response = await plaidClient.transactionsGet(request);
        let transactions = response.data.transactions;
        const total_transactions = response.data.total_transactions;
        // Manipulate the offset parameter to paginate
        // transactions and retrieve all available data
        while (transactions.length < total_transactions) {
          const paginatedRequest: TransactionsGetRequest = {
            access_token: accessToken,
            start_date: '2018-01-01',
            end_date: '2024-04-07',
            options: {
              offset: transactions.length
            },
          };
          const paginatedResponse = await plaidClient.transactionsGet(paginatedRequest);
          transactions = transactions.concat(
            paginatedResponse.data.transactions,
          );
        }
        console.log(transactions[0])
      } catch (error) {
        console.error(error)
      }
      
}

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (session === null) {
        redirect('/api/auth/signin');
    }

    await getTransactions()

    const purchases = await getPurchases(session?.user?.email as string) || [];
    
    return (
        <div className="h-screen bg-white md:grid md:grid-cols-5 md:grid-flow-dense lg:grid-cols-7 xl:grid-cols-9">
            <Sidebar className={"flex space-x-4 pt-10 justify-center md:order-2 md:space-x-0 md:block md:w-50 md:col-span-1 md:mt-10 md:mr-10 md:text-right"} />
            <main className="mb-8 md:col-span-4 md:order-1 lg:col-span-6 xl:col-span-8">
                <Purchases purchases={purchases} />
                <AddPurchase email={session?.user?.email} />
            </main>
        </div>
    )
}