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

  adapter: MongoDBAdapter(clientPromise),

  session: {
    strategy: "database",
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isAdmin = Boolean(user.isAdmin);
      }
      return session;
    },

    // Add this callback to handle redirects properly
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
/** ```

## 3. **Google Cloud Console - Update Authorized Redirect URIs**

Add these URLs to your Google OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
```
// https://full-stack-e-com-five.vercel.app/api/auth/callback/google
```

Also add your local development URL:
```
http://localhost:3000/api/auth/callback/google*/

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
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import NextAuth, { DefaultSession } from "next-auth";
// import clientPromise from "@/lib/db";
// import authConfig from "@/auth.config";
// import { ICartState } from "./app/store/Cart/CartSlice";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       isAdmin: boolean;
//       wishlist: string[];
//       order: ICartState[];
//     } & DefaultSession["user"];
//   }

//   interface User {
//     isAdmin?: boolean;
//   }
// }

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   // Add this for production
//   trustHost: true,

//   adapter: MongoDBAdapter(clientPromise),

//   session: {
//     strategy: "database",
//   },

//   callbacks: {
//     async session({ session, user }) {
//       if (session.user) {
//         session.user.id = user.id;

//         // Simply use the isAdmin field from the database user object
//         // No cache, always fresh from DB
//         session.user.isAdmin = Boolean(user.isAdmin);
//       }
//       return session;
//     },
//   },
// });

// import NextAuth, { DefaultSession } from "next-auth";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
// import clientPromise from "./lib/db";
// import authConfig from "./auth.config";
// import { ICartState } from "./app/store/Cart/CartSlice";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       isAdmin: boolean;
//       wishlist: string[];
//       order: ICartState[];
//     } & DefaultSession["user"];
//   }

//   interface User {
//     isAdmin?: boolean;
//   }
// }

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   trustHost: true,

//   session: {
//     strategy: "jwt", // Use JWT instead of database
//   },

//   adapter: MongoDBAdapter(clientPromise),

//   callbacks: {
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.sub as string;
//         session.user.isAdmin = Boolean(token.isAdmin) || false;
//         // Initialize arrays if needed
//         session.user.wishlist = [];
//         session.user.order = [];
//       }
//       return session;
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.isAdmin = (user as any).isAdmin || false;
//       }
//       return token;
//     },
//   },

//   pages: {
//     signIn: "/auth/signin",
//     error: "/auth/error", // Make sure this matches your route
//   },
// });

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
