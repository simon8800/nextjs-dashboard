import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Form validation
import { z } from 'zod';

// Generally recommended to use alternative providers such as OAuth or email
// https://authjs.dev/getting-started/providers
import Credentials from 'next-auth/providers/credentials';

import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { parse } from "path";

// Query the user with email
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`
    return user.rows[0]
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        
        // Query user after validating credentials
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordMatch = await bcrypt.compare(password, user.password);
          
          if (passwordMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      }
    })],
});