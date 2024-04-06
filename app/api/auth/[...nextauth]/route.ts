import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string
    }),
  ],
  debug: false
}

export const handler = NextAuth(options);

export { handler as GET, handler as POST };