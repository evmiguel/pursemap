import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  return (
    <>
      <main className="flex bg-white text-black min-h-screen flex-col items-center justify-between p-24">
      {session?.user?.name ?
        (
            `Hello ${session?.user?.name}`
        ) : (
          `Please log in`
        )
      }
      </main>
    </>
  );
}
