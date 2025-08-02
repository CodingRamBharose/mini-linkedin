// types/User.ts
export interface SafeUser {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  emailVerified?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}
