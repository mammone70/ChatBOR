'use server'

import { semanticSearchTranscripts } from "@/data/transcripts";
import { ChatSchema } from "@/schemas";
import * as z from "zod";

import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createStreamableValue } from 'ai/rsc';
import { getVectorDB } from "@/lib/langchain";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";

const promptTemplate = PromptTemplate.fromTemplate(`Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

{context}

Question: {question}

Helpful Answer:`
);

export const chat = async (values: z.infer<typeof ChatSchema>) => {
    const validateFields = ChatSchema.safeParse(values);

    if (!validateFields.success){
        return { error: "Invalid fields!" };
    }

    const { message } = validateFields.data;

    const streamableStatus = createStreamableValue("");

    (async () => {
        const llm = new ChatOpenAI({
            temperature: 0.9,
            model: "gpt-3.5-turbo-1106",
            // In Node.js defaults to process.env.ANTHROPIC_API_KEY,
            // apiKey: "YOUR-API-KEY",
            maxTokens: 2000,
        });
        
        //create multi query retriever so we can generate multiple
        //queries to improve upon the user's query
        const pgVectorStore = getVectorDB();
        const multiQueryRetriever = MultiQueryRetriever.fromLLM({
            llm:llm,
            retriever : pgVectorStore.asRetriever(),
            verbose: true,
        });

        //Create Contextual Compression object so that
        //we can iterate over returned documents to pull
        //out relevant info from all of the returned docs
        const baseCompressor = LLMChainExtractor.fromLLM(llm);
        const compressionRetriever = new ContextualCompressionRetriever({
            baseCompressor,
            baseRetriever: multiQueryRetriever,
        });

        // const transcriptChunks = await semanticSearchTranscripts(message);

        //get relevant docs
        const transcriptChunks = await compressionRetriever.invoke(message);

        let chunkContext = ""; 
        transcriptChunks.map((chunk) => {
            chunkContext += `${chunk.pageContent} `
        });

        const formattedPrompt = await promptTemplate.format({
            question : message,
            context : chunkContext,
        });

        // console.log(formattedPrompt);

        const chain = promptTemplate.pipe(llm);
        const stream = await chain.stream({
            question : message,
            context : chunkContext,    
        });

        for await (const chunk of stream) {
            // console.log("Chunk: " + chunk.content.toString())
            streamableStatus.update(chunk.content.toString())
        }

        streamableStatus.done();
    })();

    return { 
        success: "Message received!",
        // chunks : JSON.stringify(transcriptChunks),
        status : streamableStatus.value,
    }
}