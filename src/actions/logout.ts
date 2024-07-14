"use server"

import { signOut } from "@/auth";

export const logout = async () => {
    //Can do server stuff here

    await signOut();
}