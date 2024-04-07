import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import SessionProvider from "../components/SessionProvider";
import "./globals.css";
import NavMenu from "@/components/NavMenu";
import { authOptions } from "./api/auth/[...nextauth]/options";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Purse Map",
  description: "Map your purchases to actual things!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${inter.className} text-base`}>
        <SessionProvider session={session}>
          <NavMenu />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
