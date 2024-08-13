import { db } from "@/drizzle/db";
import { transcript_chunks, transcripts } from "@/drizzle/schema";
import { generateOpenAIEmbedding } from "@/lib/embed";
import { 
    cosineDistance, l1Distance, l2Distance,
    sql, 
    gt, 
    eq, 
    desc,
    or, 
} from "drizzle-orm";

import type { BaseLanguageModelInterface } from "@langchain/core/language_models/base";

export interface Transcript {
    name: string;
    id: string;
    totalPages: number | null;
}

export async function multiQueryRetrieveTranscripts(
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
            transcript_chunks.embedding,
            vectorQuery
        )})`

        const transcriptsWithChunk = 
            await   db
                    .select({
                        transcriptId : transcripts.id,
                        transcriptName : transcripts.name,
                        chunkId : transcript_chunks.id,
                        pageNumber : transcript_chunks.pageNumber,
                        fromLine : transcript_chunks.fromLine,
                        toLine : transcript_chunks.toLine,
                        content : transcript_chunks.content,
                    })
                    .from(transcript_chunks)
                    .where(gt(similarity, minSimilarity))
                    .leftJoin(transcripts, 
                        eq(transcripts.id, transcript_chunks.transcriptId)) 
                    .limit(maxResults);

        return transcriptsWithChunk;
    }
    catch (error) {
        throw error;
    }
}

export async function semanticSearchTranscripts(
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
            transcript_chunks.embedding,
            vectorQuery
        )})`

        const transcriptsWithChunk = 
            await   db
                    .select({
                        transcriptId : transcripts.id,
                        transcriptName : transcripts.name,
                        chunkId : transcript_chunks.id,
                        pageNumber : transcript_chunks.pageNumber,
                        fromLine : transcript_chunks.fromLine,
                        toLine : transcript_chunks.toLine,
                        content : transcript_chunks.content,
                        similarity,
                    })
                    .from(transcript_chunks)
                    .where(
                        or (
                            //vector/embedding match
                            gt(similarity, minSimilarity),
                            //full text/keyword match
                            sql`to_tsvector('english', 
                                ${transcript_chunks.content}) @@ plainto_tsquery('english', ${query})`
                        )
                    )
                    .leftJoin(transcripts, 
                        eq(transcripts.id, transcript_chunks.transcriptId)) 
                    // .orderBy((t) => desc(t.similarity))    
                    .limit(maxResults);

        return transcriptsWithChunk;
    }
    catch (error) {
        throw error;
    }
};

export async function getTranscripts() : Promise<Transcript[]> {
    const transcripts = await db.query.transcripts.findMany();
    return transcripts;
};