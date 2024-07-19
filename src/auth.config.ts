import Credentials from "@auth/core/providers/credentials";
import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google";

import bcrypt from "bcryptjs";

import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET){
  throw new Error('Missing Google oauth credentials');
}

export default {
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
        async authorize(credentials){
            const validatedFields = LoginSchema.safeParse(credentials);

            if(validatedFields.success){
                const { email, password } = validatedFields.data;

                const user = await getUserByEmail(email);
                
                //logged in with an OAuth provider, not credentials
                if(!user || !user.password) return null;

                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (passwordsMatch) return user;
            }

            return null;
        }
    })
  ],
} satisfies NextAuthConfig