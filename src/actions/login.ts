'use server';

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";

import { getUserByEmail } from "@/dao/user";
// import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";

import * as z from "zod";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/dao/two-factor-token";
import { db } from "@/drizzle/db";
import { getTwoFactorConfirmationByUserId } from "@/dao/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validateFields = LoginSchema.safeParse(values);

    if (!validateFields.success){
        return { error: "Invalid fields!" };
    }

    const { email, password, code } = validateFields.data;

    const existingUser = await getUserByEmail(email);

    //if not existing user or user is OAuth user
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist." }
    }

    if (!existingUser.emailVerified){
        // const verificationToken = await generateVerificationToken(
        //     existingUser.email,
        // );

        // await sendVerificationEmail(
        //     verificationToken.email,
        //     verificationToken.token,
        // );
        
        return { success: "Confirmation email sent!" }
    }

    // if(existingUser.isTwoFactorEnabled && existingUser.email){
    //     if(code) {
    //         console.log(code);
    //         //Verify code
    //         const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

    //         if(!twoFactorToken){
    //             return { error: "Invalid code!" };
    //         }

    //         if(twoFactorToken.token !== code){
    //             return { error: "Invalid code!" };
    //         }

    //         const hasExpired = new Date(twoFactorToken.expires) < new Date();

    //         if(hasExpired) {
    //             return { error: "Code has expired." };
    //         } 

    //         await db.twoFactorToken.delete({
    //             where: { id: twoFactorToken.id }
    //         });

    //         const existingConfirmation 
    //             = await getTwoFactorConfirmationByUserId(existingUser.id);

    //         if (existingConfirmation) {
    //             await db.twoFactorConfirmation.delete({
    //                 where : { id : existingConfirmation.id }
    //             });
    //         }

    //         await db.twoFactorConfirmation.create({
    //             data: {
    //                 userId: existingUser.id,
    //             }
    //         });
    //     } else {
    //         //generate and send code
    //         const twoFactorToken = 
    //             await generateTwoFactorToken(existingUser.email);

    //         await sendTwoFactorTokenEmail(
    //             twoFactorToken.email, 
    //             twoFactorToken.token
    //         );
            
    //         return { twoFactor: true };
    //     }
    // }

    //Login
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error){
        if (error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin":
                    return { error: "Invalid Credentials" }
                default:
                    return { error: "Something went wrong." }
            }
        }

        //have to do this to redirect
        throw error;
    }
};