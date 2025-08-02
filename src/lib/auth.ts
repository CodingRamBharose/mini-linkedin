import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/config/dbConnect";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            if (user.isVerified) {
              const isPasswordCorrect = await bcrypt.compare(
                credentials.password,
                user.password
              );
              if (isPasswordCorrect) {
                return {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  isVerified: user.isVerified,
                };
              }
            } else {
              throw new Error("Please verify your account before logging in.");
            }
          } else {
            throw new Error("No user found with this email");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id;
        token.isVerified = user.isVerified;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token._id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
}; 