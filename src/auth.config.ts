import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

// Notice this is only an object, not a full Auth.js instance
// concider this as a age function
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
