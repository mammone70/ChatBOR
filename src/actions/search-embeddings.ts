'use server'

import { semanticSearchTranscripts } from "@/data/transcripts";
import { ChatSchema } from "@/schemas";
import * as z from "zod";

export const searchEmbeddings = async (values: z.infer<typeof ChatSchema>) => {
    const validateFields = ChatSchema.safeParse(values);

    if (!validateFields.success){
        return { error: "Invalid fields!" };
    }

    const { message } = validateFields.data;

    const transcriptChunks = await semanticSearchTranscripts(message);
    
    return { 
        success: "Message received!",
        chunks : transcriptChunks,
    }

}