import { pool } from "@/drizzle/db";
import { OpenAIEmbeddings } from "@langchain/openai";
import {
    DistanceStrategy,
    PGVectorStore,
  } from "@langchain/community/vectorstores/pgvector";

export function getVectorDB(){
    const originalConfig = {
        pool: pool,
        tableName: "transcript_chunks",
        columns: {
            idColumnName: "id",
            vectorColumnName: "embedding",
            contentColumnName: "content",
            metadataColumnName: "pageNumber",
        },
          // supported distance strategies: cosine (default), innerProduct, or euclidean
        distanceStrategy: "cosine" as DistanceStrategy,
    };


    return new PGVectorStore(
        new OpenAIEmbeddings({
            model: 'text-embedding-3-large',
            dimensions: 1024
        }), 
        originalConfig,
    );
}