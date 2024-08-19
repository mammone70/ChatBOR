'use server';

import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import { transcript_chunks, transcripts } from "@/drizzle/schema";
import { DeleteFileSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

// import { UploadFileSchema } from "@/schemas";

import * as z from "zod";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { formatTextForDatabase, generateOpenAIEmbedding } from "@/lib/embed";
import { ChatOpenAI } from "@langchain/openai";
import { loadSummarizationChain } from "langchain/chains";

//llm
const llm = new ChatOpenAI({
    temperature: 0.3,
    model: "gpt-3.5-turbo-1106",
    // In Node.js defaults to process.env.ANTHROPIC_API_KEY,
    // apiKey: "YOUR-API-KEY",
    maxTokens: 2000,
});
  
//summarizer
const summarizer = loadSummarizationChain(llm);

// export const uploadFile = async (values: z.infer<typeof UploadFileSchema>) => {
export const uploadFile = async (formData: FormData) => {
    const session = await auth();
    if(!session){
        return { error : "No session." };
    }
    
    const files = formData.getAll("files") as File[];
    const uploadFile = await files[0];
    // const title = formData.get("title");
    
    try {
        const fileBuffer = Buffer.from(await uploadFile.arrayBuffer());  
        const loader = new WebPDFLoader(new Blob([fileBuffer]));
        const docs = await loader.load();  
        
        //splitter
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const splitDocs = await splitter.splitDocuments(docs);

        //insert file into DB
        const dbFile = 
            await db
            .insert(transcripts)
            .values({ 
                name : uploadFile.name, 
                totalPages : splitDocs[0].metadata.pdf.totalPages,
            })
            .returning({ id : transcripts.id });
        
        for (const docChunk of splitDocs) {
            //set chunk metadata
            const newChunkObject = {
            pageNumber : docChunk.metadata.loc.pageNumber,
            fromLine : docChunk.metadata.loc.lines.from,
            toLine : docChunk.metadata.loc.lines.to,
            content : formatTextForDatabase(docChunk.pageContent), 
            transcriptId : dbFile[0].id,
            }
        
            //summarize chunk before for better embedding
            const summary = await summarizer.invoke({
            input_documents: [docChunk.pageContent],
            });
        
            //Generate and set embedding
            const embedding = await generateOpenAIEmbedding(docChunk.pageContent);
        
            //insert transcript chunk with embedding
            await db
                .insert(transcript_chunks)
                .values({...newChunkObject, embedding });
        }

        revalidatePath("/files");
        return { success : `${uploadFile.name} stored and embeddedings generated!` };
    }
    catch(error) {
        return { error : error }
    }
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