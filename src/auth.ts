import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import { db } from "@/drizzle/db";
import authConfig from "@/auth.config";
import { eq } from "drizzle-orm";
import { users } from "@/drizzle/schemas/auth/users";
import { getUserById } from "@/dao/user";

export type ExtendedUser = DefaultSession["user"] & {
  userRole: "USER" | "ADMIN",
};

declare module "next-auth" {
  interface Session {
      user: ExtendedUser;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy : "jwt",
    updateAge : 3600,
  },
  events: {
      async linkAccount({ user }) {
          await   db
                  .update(users)
                  .set({
                      emailVerified : new Date()
                  })
                  .where(eq(users.id, user.id as string));
      }
  },
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
        //allow OAuth without email verification
        if (account?.provider !== "credentials") return true;

        if(user && user.id){
            const existingUser = await getUserById(user.id);
            
            //prevent sign in without email verification
            if(existingUser && existingUser.emailVerified){
                // if(existingUser.isTwoFactorEnabled) {
                //     const twoFactorConfirmation = 
                //         await getTwoFactorConfirmationByUserId(existingUser.id);
                        
                //     if (!twoFactorConfirmation) return false;

                //     //Delete 2FA for next sign in
                //     await db.twoFactorConfirmation.delete({
                //         where: { id: twoFactorConfirmation.id },
                //     });

                //     //TODO add time period users don't need to use 2FA
                //     //TODO track 2FA by device
                // }
                
                return true;
            } else {
                return false;
            }
        }

        return false;
    },
    async session({token, session, user}){
        //usually not needed, fixing a bug in nextauth
        if(session && user) {
            session.user.id = user.id;
        }

        if(token.sub && session.user){
            session.user.id = token.sub
        }

        // if (token.role && session.user) {
        //     session.user.userRole = token.role;
        // }
        return session;
    },
    async jwt({ token }) {
       //not logged in
        if(!token.sub) return token;
        
        const existingUser = await getUserById(token.sub);

        if (!existingUser) return token; //new user


        // token.role = existingUser.role;
        
        return token;
    },
  }
});









// import NextAuth, { DefaultSession } from 'next-auth';
// import { DrizzleAdapter } from '@auth/drizzle-adapter';

// import { db } from '@/drizzle/db';

// import authConfig from '@/auth.config';
// import { getUserById } from '@/data/user';
// import { eq } from 'drizzle-orm';
// import { users } from './drizzle/schema';
// // import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation';

// // export type ExtendedUser = DefaultSession["user"] & 

// declare module "next-auth" {
//     interface Session {
//         user: {
//             role: "ADMIN" | "USER"
//         } & DefaultSession["user"]
//     }
// }

// export const {
//     handlers: {
//         GET,
//         POST, 
//     },
//     auth, 
//     signIn,
//     signOut,
// } = NextAuth({
//     pages: {
//         signIn: "/auth/login",
//         error: "/auth/error",
//     },
//     events: {
//       async linkAccount({ account }) {
//         await   db.update(users)
//                 .set({
//                   emailVerified: new Date()
//                 })    
//                 .where(eq(users.id, account.userId!))
//       }
//     },
//     adapter: DrizzleAdapter(db),
//     ...authConfig,
//     session: { strategy: "jwt" },
//     callbacks: {
//         async signIn({ user, account }) {
//             //allow OAuth without email verification
//             if (account?.provider !== "credentials") return true;

//             if(user && user.id){
//                 const existingUser = await getUserById(user.id);
                
//                 //prevent sign in without email verification
//                 // if(existingUser && existingUser.emailVerified){
//                 //     if(existingUser.isTwoFactorEnabled) {
//                 //         const twoFactorConfirmation = 
//                 //             await getTwoFactorConfirmationByUserId(existingUser.id);
                            
//                 //         if (!twoFactorConfirmation) return false;

//                 //         //Delete 2FA for next sign in
//                 //         await db.twoFactorConfirmation.delete({
//                 //             where: { id: twoFactorConfirmation.id },
//                 //         });
    
//                 //         //TODO add time period users don't need to use 2FA
//                 //         //TODO track 2FA by device
//                 //     }
                    
//                 //     return true;
//                 // } else {
//                 //     return false;
//                 // }
//             }

//             return false;
//         },
//         async session({token, session, user}){
//             //usually not needed, fixing a bug in nextauth
//             if(session && user) {
//                 session.user.id = user.id;
//             }

//             if(token.sub && session.user){
//                 session.user.id = token.sub
//             }

//             // if (token.role && session.user) {
//             //     session.user.role = token.role as UserRole;
//             // }

//             return session;
//         },
//         async jwt({ token }) {
//            //not logged in
//             if(!token.sub) return token;
            
//             //token.exp = Math.round(Date.now() / 1000) + 900;

//             const existingUser = await getUserById(token.sub);

//             if (!existingUser) return token; //new user

//             // token.role = existingUser.role;
            
//             return token;
//         },
//     }
// });