'use server'

import { semanticSearchTranscripts } from "@/data/transcripts";
import { ChatSchema } from "@/schemas";
import * as z from "zod";

import { 
    PromptTemplate, 
    ChatPromptTemplate,
    MessagesPlaceholder
} from "@langchain/core/prompts";

import { ChatOpenAI } from "@langchain/openai";
import { createStreamableValue } from 'ai/rsc';
import { getVectorDB } from "@/lib/langchain";
import { MultiQueryRetriever } from "langchain/retrievers/multi_query";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { PostgresChatMessageHistory } from "@langchain/community/stores/message/postgres";
import { pool } from "@/drizzle/db";

// const promptTemplate = PromptTemplate.fromTemplate(`Use the following pieces of context to answer the question at the end.
// If you don't know the answer, just say that you don't know, don't try to make up an answer.

// {context}

// Question: {question}

// Helpful Answer:`
// );

const qaSystemPrompt = `You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
Provide as much detail as possible without getting off topic.
If you don't know the answer, just say that you don't know.

{context}`
    
const contextualizeQSystemPrompt = "Given a chat history and the latest user question \
which might reference context in the chat history, formulate a standalone question \
which can be understood without the chat history. Do NOT answer the question, \
just reformulate it if needed and otherwise return it as is."

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
            // model: "gpt-3.5-turbo-1106",
            model: "gpt-4o-mini",
            // In Node.js defaults to process.env.ANTHROPIC_API_KEY,
            // apiKey: "YOUR-API-KEY",
            maxTokens: 2000,
        });
        
        //create multi query retriever so we can generate multiple
        //queries to improve upon the user's query
        const pgVectorStore = getVectorDB();
        // const multiQueryRetriever = MultiQueryRetriever.fromLLM({
        //     llm:llm,
        //     retriever : pgVectorStore.asRetriever(),
        //     verbose: true,
        // });

        const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
            ["system", contextualizeQSystemPrompt],
            new MessagesPlaceholder("chat_history"),
            ["human", "{input}"],
        ]);

        //Create Contextual Compression object so that
        //we can iterate over returned documents to pull
        //out relevant info from all of the returned docs
        const baseCompressor = LLMChainExtractor.fromLLM(llm);
        const compressionRetriever = new ContextualCompressionRetriever({
            baseCompressor,
            baseRetriever: pgVectorStore.asRetriever(),
        });

        const historyAwareRetriever = await createHistoryAwareRetriever({
            llm,
            // retriever : pgVectorStore.asRetriever(),
            retriever : compressionRetriever,
            rephrasePrompt : contextualizeQPrompt,
        });

        const qaPrompt = ChatPromptTemplate.fromMessages([
            ["system", qaSystemPrompt],
            new MessagesPlaceholder("chat_history"),
            ["human", "{input}"],    
        ]);

        const qaChain = await createStuffDocumentsChain({
            llm,
            prompt : qaPrompt,
        });

        const ragChain = await createRetrievalChain({
            retriever : historyAwareRetriever,
            combineDocsChain : qaChain,
        });

        const chainWithHistory = new RunnableWithMessageHistory({
            runnable: ragChain,
            inputMessagesKey : "input",
            historyMessagesKey : "chat_history",
            outputMessagesKey : "answer",
            getMessageHistory: async (sessionId) => {
                const chatHistory = new PostgresChatMessageHistory({
                  sessionId,
                  pool,
                });
                return chatHistory;
            },
        });

        
        // const transcriptChunks = await semanticSearchTranscripts(message);

        //get relevant docs
        // const transcriptChunks = await compressionRetriever.invoke(message);

        // let chunkContext = ""; 
        // transcriptChunks.map((chunk) => {
        //     chunkContext += `${chunk.pageContent} `
        // });

        // const formattedPrompt = await promptTemplate.format({
        //     question : message,
        //     context : chunkContext,
        // });

        
        // console.log(formattedPrompt);

        // const chain = promptTemplate.pipe(llm);

        const stream = await chainWithHistory.stream(
            {input : message},
            { configurable: { sessionId: "langchain-test-session" } },
        );

        for await (const chunk of stream) {
            // console.log("Chunk: " + chunk.content.toString())
            streamableStatus.update(chunk.answer);
        }

        streamableStatus.done();
    })();

    return { 
        success: "Message received!",
        // chunks : JSON.stringify(transcriptChunks),
        status : streamableStatus.value,
    }
}