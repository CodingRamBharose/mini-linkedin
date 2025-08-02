import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/config/dbConnect';
import bcrypt from 'bcryptjs';
import UserModel from '@/models/User';

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await dbConnect();

        const user = await UserModel.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.isVerified) {
          throw new Error('Please verify your email first');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id?.toString(),
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          bio: user.bio,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.name = user.name;
        token.email = user.email;
        token.bio = user.bio;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        isVerified: token.isVerified,
        name: token.name,
        email: token.email,
        bio: token.bio,
      };
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (account?.provider === "google") {
        await dbConnect();
        const existingUser = await UserModel.findOne({ email: user.email });

        if (existingUser) {
          // If user exists, update the user object with database values
          user.id = existingUser.id.toString();
          user.isVerified = existingUser.isVerified;
          user.bio = existingUser.bio;
          
          // Ensure Google users have emailVerified set
          if (!existingUser.emailVerified && existingUser.isVerified) {
            existingUser.emailVerified = new Date();
            await existingUser.save();
          }
        } else {
          // If user doesn't exist, create a new user record
          try {
            // Generate random verification code (not needed for Google auth but required by schema)
            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Create a random password (not used for Google auth but required by schema)
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            // Create new user
            const newUser = await UserModel.create({
              name: user.name || profile?.name || 'User',
              email: user.email,
              password: hashedPassword,
              verifyCode,
              verifyCodeExpiry,
              isVerified: true, 
              emailVerified: new Date(), // Set email as verified for Google auth
              bio: '',
            });

            // Update user object with the new user's ID and properties
            user.id = newUser._id.toString();
            user.isVerified = true;
            user.bio = newUser.bio;

          } catch {
            return false; // Prevent sign-in if user creation fails
          }
        }
        return true;
      }
      return false;
    }
  },

  pages: {
    signIn: '/sign-in',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
