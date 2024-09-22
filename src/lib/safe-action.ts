/**
 * Library functions to perform save NextJS Server Actions
 */

import { createServerActionProcedure } from "zsa";
import { assertAuthenticated } from "@/lib/session";

export const authenticatedAction 
    =   createServerActionProcedure()
            .handler(async () => {
                const user = await assertAuthenticated();
                
                //TODO Add Rate Limiter
                
                return { user };
            });

export const unauthenticatedAction 
    =   createServerActionProcedure()
            .handler(async () => {
                //TODO Add Rate Limiter            
            });