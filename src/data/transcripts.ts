import { db } from "@/drizzle/db";
import { transcript_chunks, transcripts } from "@/drizzle/schema";
import { generateEmbedding } from "@/lib/embed";
import { cosineDistance, sql, gt, eq } from "drizzle-orm";

export async function semanticSearchTranscripts(query : string){
    try {
        if (query.trim().length === 0) return [];

        const embedding = await generateEmbedding(query)
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
                    .where(gt(similarity, 0.5))
                    .leftJoin(transcripts, 
                        eq(transcripts.id, transcript_chunks.transcriptId)) 
                    .limit(10);
        console.log(transcriptsWithChunk)
        return transcriptsWithChunk;
    }
    catch (error) {
        throw error;
    }
}