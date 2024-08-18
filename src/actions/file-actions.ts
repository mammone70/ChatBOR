'use server';

import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import { transcripts } from "@/drizzle/schema";
import { DeleteFileSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// import { UploadFileSchema } from "@/schemas";

import * as z from "zod";

// export const uploadFile = async (values: z.infer<typeof UploadFileSchema>) => {
export const uploadFile = async (formData: FormData) => {
    const session = await auth();
    if(!session){
        return { error : "No session." };
    }
    
    const files = formData.getAll("files") as File[];
    const title = formData.get("title");
    
}

export const deleteFile = async (values: z.infer<typeof DeleteFileSchema>) => {
    const session = await auth();
    if(!session){
        return { error : "No session." };
    }

    const deleteId = values.id;

    try {
        const deletedFile = 
            await   db
            .delete(transcripts)
            .where(eq(transcripts.id, deleteId ))
            .returning();

            revalidatePath("/files");
            return { success : `${deletedFile[0].name} deleted!` };
    }   
    catch(error) {
        return { error : error }
    }
}