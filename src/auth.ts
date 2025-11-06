// // lib/auth.ts
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import NextAuth, { DefaultSession } from "next-auth";
// import Google from "next-auth/providers/google";
// import clientPromise from "@/lib/db";
// const adminEmails = ["mazenmoabdo@gmail.com"];

// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user?: {
//       id: string;
//       isAdmin: boolean;
//     } & DefaultSession["user"];
//   }
// }

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID!,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (session.user && token.sub) {
//         session.user.id = token.sub;
//         if (adminEmails.includes(session.user.email)) {
//           session.user.isAdmin = true;
//         }
//         return session;
//       }
//       return session;
//     },
//     // jwt: async ({ token, account, profile }) => {

//     //   return token;
//     // },
//   },

//     adapter: MongoDBAdapter(clientPromise),
// });

// lib/auth.ts
// auth.ts
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import clientPromise from "@/lib/db";
import authConfig from "@/auth.config";
import { ICartState } from "./app/store/Cart/CartSlice";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      wishlist: string[];
      order: ICartState[];
    } & DefaultSession["user"];
  }

  interface User {
    isAdmin?: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  adapter: MongoDBAdapter(clientPromise),

  session: {
    strategy: "jwt",
    // "database",
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Simply use the isAdmin field from the database user object
        // No cache, always fresh from DB
        session.user.isAdmin = Boolean(user.isAdmin);
      }
      return session;
    },
  },
});

// lib/auth.ts
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import clientPromise from "@/lib/db";
// import { DefaultSession } from "next-auth";

// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user?: {
//       id: string;
//       isAdmin: boolean;
//     } & DefaultSession["user"];
//   }
// }

// const adminEmails = ["mazenmoabdo@gmail.com"];

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID!,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET!,
//     }),
//   ],

//   // adapter: MongoDBAdapter(clientPromise),

//   callbacks: {
//     async session({ session, user }) {
//       // When using an adapter, user info comes from the database

//       if (session.user && user) {
//         session.user.id = user.id;

//         // Check if user email is in admin list
//
//         if (session.user.email && adminEmails.includes(session.user.email)) {
//           session.user.isAdmin = true;
//         } else {
//           session.user.isAdmin = false;
//         }
//       }
//       return session;
//     },

//     async jwt({ token, account, profile, user }) {
//       // Initial sign in
//       if (account && profile) {
//         token.sub = user?.id;
//       }
//       return token;
//     },
//   },

//   // Optional: Add these for better security and UX
//   session: {
//     strategy: "jwt", // or "database" if you prefer database sessions
//     maxAge: 30 * 24 * 60 * 60,
//   },

//   pages: {
//     signIn: "/auth/signin", // Custom sign-in page (optional)
//     error: "/auth/error", // Error page (optional)
//   },
// });
