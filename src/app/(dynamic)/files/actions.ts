'use server';

import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import { transcript_chunks, transcripts } from "@/drizzle/schema";
import { DeleteFileSchema, UploadFileSchema } from "@/schemas";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { put } from '@vercel/blob';

// import { UploadFileSchema } from "@/schemas";

import * as z from "zod";

import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatOpenAI } from "@langchain/openai";
import { loadSummarizationChain } from "langchain/chains";
import { embedDocumentChunks } from "@/dao/transcripts";
import { authenticatedAction } from "@/lib/safe-action";
import { deleteFileUseCase, uploadFileUseCase } from "@/business/files";

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

export const uploadFileServerAction 
    =   authenticatedAction
            .createServerAction()
            .input(
                UploadFileSchema,
                {
                    type : "state",
                }
            )
            .handler(async ({ctx, input}) => {

            // const files = formData.getAll("files") as File[];
            const uploadFile = await input.file;
    
            //Store file
            uploadFileUseCase(uploadFile);
            revalidatePath("/files");
            return { success : `${uploadFile.name} stored and embeddedings generated!` };
        });
        
    // try {
    //     const fileBuffer = Buffer.from(await uploadFile.arrayBuffer());  
    //     const loader = new WebPDFLoader(new Blob([fileBuffer]));
    //     const docs = await loader.load();  
        
    //     //splitter
    //     const splitter = new RecursiveCharacterTextSplitter({
    //         chunkSize: 1000,
    //         chunkOverlap: 200,
    //     });

    //     const splitDocs = await splitter.splitDocuments(docs);


        /**
         * Create database records for document chunks with
         * generated embeddings.
         * 
         */
        // embedDocumentChunks({
        //     docChunks : splitDocs, 
        //     mainDocId : dbFile[0].id,
        //     summarizer : summarizer,
        // });

        //add document to message queue

export const deleteFileServerAction 
    =   authenticatedAction
            .createServerAction()
            .input(DeleteFileSchema)
            .handler(async ({ctx, input}) => {
                const deletedFileName = await deleteFileUseCase(input.id)
                revalidatePath("/files");
                return { success : `${deletedFileName} deleted!` };
            })