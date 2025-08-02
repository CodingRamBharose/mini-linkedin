import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    isVerified: boolean;
    name: string;
    email: string;
    bio?: string;
  }

  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isVerified: boolean;
    name: string;
    email: string;
    bio?: string;
  }
}