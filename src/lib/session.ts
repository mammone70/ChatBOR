/**
 * Session Validation Library Functions
 */

import { auth } from "@/auth";
import { cache } from "react";

import { AuthenticationError } from "@/lib/errors";

export const getCurrentUser 
    = cache(async () => {
        const session = await auth();
        if (!session?.user) {
            return undefined;
        }
        return session.user;
    });
  
  export const assertAuthenticated = async () => {
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError();
    }
    return user;
  };