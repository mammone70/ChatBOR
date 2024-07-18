'use server'

import { semanticSearchTranscripts } from "@/data/transcripts";
import { ChatSchema } from "@/schemas";
import * as z from "zod";

import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createStreamableValue } from 'ai/rsc';
// import { concat } from "@langchain/core/utils/stream";
// import type { AIMessageChunk } from "@langchain/core/messages";

const promptTemplate = PromptTemplate.fromTemplate(`Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Keep the answer as concise as possible.

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

    const transcriptChunks = await semanticSearchTranscripts(message);

    let chunkContext = ""; 
    transcriptChunks.map((chunk) => {
        chunkContext += `${chunk.content} `
    });

    const streamableStatus = createStreamableValue("");

    (async () => {
        const llm = new ChatOpenAI({
            temperature: 0.9,
            model: "gpt-3.5-turbo-1106",
            // In Node.js defaults to process.env.ANTHROPIC_API_KEY,
            // apiKey: "YOUR-API-KEY",
            maxTokens: 2000,
        });
        
        const formattedPrompt = await promptTemplate.format({
            question : message,
            context : chunkContext,
        });

        console.log(formattedPrompt);

        const chain = promptTemplate.pipe(llm);
        const stream = await chain.stream({
            question : message,
            context : chunkContext,
            
        });

        //   const res = await llm.invoke("Why is the sky blue?");
        
        // let gathered: AIMessageChunk | undefined = undefined;

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