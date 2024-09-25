import { db } from "@/drizzle/db";
import { documents } from "@/drizzle/schemas/documents/documents";
import { document_chunks } from "@/drizzle/schemas/documents/document_chunks";

import { generateOpenAIEmbedding, formatTextForDatabase } from "@/lib/embed";
import { 
    cosineDistance, l1Distance, l2Distance,
    sql, 
    gt, 
    eq, 
    desc,
    or, 
} from "drizzle-orm";

import type { BaseLanguageModelInterface } from "@langchain/core/language_models/base";
import { del, put } from "@vercel/blob";
import { queueDocument } from "@/lib/bed-chunk-q";

export interface Document {
    name: string;
    id: string;
    totalPages: number | null;
}

export async function multiQueryRetrievedocuments(
    query : string,
    llm : BaseLanguageModelInterface,
    minSimilarity : number = .5,
    maxResults : number = 100,
){
    try {
        if (query.trim().length === 0) return [];

        const embedding = await generateOpenAIEmbedding(query)
        const vectorQuery = `[${embedding.join(',')}]`

        const similarity = sql<number>`1 - (${cosineDistance(
            document_chunks.embedding,
            vectorQuery
        )})`

        const documentsWithChunk = 
            await   db
                    .select({
                        documentId : documents.id,
                        documentName : documents.name,
                        chunkId : document_chunks.id,
                        pageNumber : document_chunks.pageNumber,
                        fromLine : document_chunks.fromLine,
                        toLine : document_chunks.toLine,
                        content : document_chunks.content,
                    })
                    .from(document_chunks)
                    .where(gt(similarity, minSimilarity))
                    .leftJoin(documents, 
                        eq(documents.id, document_chunks.documentId)) 
                    .limit(maxResults);

        return documentsWithChunk;
    }
    catch (error) {
        throw error;
    }
}

export async function semanticSearchDocuments(
    query : string,
    minSimilarity : number = .5,
    maxResults : number = 0
){
    try {
        if (query.trim().length === 0) return [];
        console.log(query);
        const embedding = await generateOpenAIEmbedding(query)
        const vectorQuery = `[${embedding.join(',')}]`

        const similarity = sql<number>`1 - (${cosineDistance(
            document_chunks.embedding,
            vectorQuery
        )})`

        const documentsWithChunk = 
            await   db
                    .select({
                        documentId : documents.id,
                        documentName : documents.name,
                        chunkId : document_chunks.id,
                        pageNumber : document_chunks.pageNumber,
                        fromLine : document_chunks.fromLine,
                        toLine : document_chunks.toLine,
                        content : document_chunks.content,
                        similarity,
                    })
                    .from(document_chunks)
                    .where(
                        or (
                            //vector/embedding match
                            gt(similarity, minSimilarity),
                            //full text/keyword match
                            sql`to_tsvector('english', 
                                ${document_chunks.content}) @@ plainto_tsquery('english', ${query})`
                        )
                    )
                    .leftJoin(documents, 
                        eq(documents.id, document_chunks.documentId)) 
                    // .orderBy((t) => desc(t.similarity))    
                    .limit(maxResults);

        return documentsWithChunk;
    }
    catch (error) {
        throw error;
    }
};

export async function getDocuments() : Promise<Document[]> {
    // const documents = await db.query.documents.findMany();
    const docs = await db.select().from(documents);
    return docs;
};

/**
 * Store File in Blob storage and metadata in DB
 * @param file File object to store
 */
export async function storeFile(file : File){
    //TODO could abstract blob, metadata, and embedding storage to decouple
    //implementations from one another

    //insert file into DB
    const dbFile = 
        await db
        .insert(documents)
        .values({ 
            name : file.name, 
        })
        .returning({ id : documents.id });

    
    //insert file into blob storage
    const blob = await put(file.name, file, {
        access: 'public',
    });

    //Queue file to be chunked and embedded
    queueDocument({
        documentId : dbFile[0].id,
        documentBlobURL: blob.url,
    })
}

/**
 * Delete document from DB and Blob storage
 * @param documentId ID of document to delete
 */
export async function deletedocument(documentId : string){
    const deletedFiles = 
        await   db
        .delete(documents)
        .where(eq(documents.id, documentId ))
        .returning();
    
    //delete the file from Blob storage
    if(deletedFiles[0]?.blobURL)
        await del(deletedFiles[0].blobURL) 

    return deletedFiles[0]?.name;
}