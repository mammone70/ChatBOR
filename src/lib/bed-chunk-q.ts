/**
 * Utility functions to communicate with Chunk Bedder MQ
 */

import { MissingMQURLError } from "./errors";

/**
 * Interface defining parameter structure for the 
 * QueueDocument method.
 */
export interface QueueDocumentProps {
    //UUID of the DB record of the Document being queued
    documentId : string,

    //URL of Blob corresponding to the Document being queued
    documentBlobURL : string,
}

export async function queueDocument(params : QueueDocumentProps){
    
    if(!process.env.CHUNK_BEDDER_MQ_URL)
        throw new MissingMQURLError();

    await fetch(
        process.env.CHUNK_BEDDER_MQ_URL, //TODO env variable
        {
            //TODO Auth Header
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                documentId : params.documentId,
                url : params.documentBlobURL,
            }),
        })
        .then(response => response.json())
        .then(data => console.log(`Document queued for embedding: ${JSON.stringify(data)}`));
}