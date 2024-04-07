import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import type { Adapter } from 'next-auth/adapters';
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    }),
  ],
  debug: false
}

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };