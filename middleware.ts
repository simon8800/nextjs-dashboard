import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Initializing NextAuth.js with the authConfig object
// Export auth property
export default NextAuth(authConfig).auth;

// Match tells middleware it should run on specific paths
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

// Advantages
// Protected routes will not start rendering until the Middlware verifies the authentication
// This enhances both the security and performance of your application