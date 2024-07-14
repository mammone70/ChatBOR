'use server'

import { ChatSchema } from "@/schemas";
import * as z from "zod";

export const chat = async (values: z.infer<typeof ChatSchema>) => {
    const validateFields = ChatSchema.safeParse(values);

    if (!validateFields.success){
        return { error: "Invalid fields!" };
    }

    const { message } = validateFields.data;

    console.log(message);

}