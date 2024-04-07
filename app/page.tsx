import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session === null) {
    redirect('/api/auth/signin');
  }

  redirect('/purchases');
}
