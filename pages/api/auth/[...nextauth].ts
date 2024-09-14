import NextAuth from "next-auth";
import Admin from '@db/models/Admin';
import dbConnect from "@db/lib/mongodb";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  // Configure one or more authentication providers
  callbacks: {
    async signIn({ 
      user 
    }: { 
      user: any; 
    }) {
      await dbConnect();
      const admin = await Admin.findOne({ email: user.email });
      if (admin) {
        return true;
      } else {
        return '/admin'
      }
    },
    async jwt({ token, account }: { token: any; account: any }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }: { session: any; token: any; user: any; }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    }
  },
  // pages: {
  //   signIn: "/admin"
  // },
  // added secret key
  secret: process.env.NEXT_PUBLIC_SECRET_KEY as string,
  providers: [
	  GoogleProvider({
          // Configure Google authentication provider with environment variables
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
        }),
      // ...add more providers here
  ],
}

export default NextAuth(authOptions);

