import 'dotenv/config'
import { db } from './db'
import { transcripts, transcript_chunks } from './schema'
import path from 'path';

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadSummarizationChain } from "langchain/chains";

import { 
  formatTextForDatabase, 
  formatTextForEmbedding, 
  generateOpenAIEmbedding 
} from '../lib/embed';
import { ChatOpenAI } from '@langchain/openai';

// import { openai } from '../lib/openai'
// import { embed } from 'ai'

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error('process.env.OPENAI_API_KEY is not defined. Please set it.')
// }

if (!process.env.DATABASE_URL) {
  throw new Error('process.env.DATABASE_URL is not defined. Please set it.')
}

//llm
const llm = new ChatOpenAI({
  temperature: 0.3,
  model: "gpt-3.5-turbo-1106",
  // In Node.js defaults to process.env.ANTHROPIC_API_KEY,
  // apiKey: "YOUR-API-KEY",
  maxTokens: 2000,
});

//splitter
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

//summarizer
const summarizer = loadSummarizationChain(llm)    

async function main() {
  try {
    const transcript = await db.query.transcripts.findFirst({
    })

    // if (transcript) {
    //   console.log('Transcripts already seeded!')
    //   return
    // }
  } catch (error) {
    console.error('Error checking if Transcripts exist in the database.')
    throw error
  }

  const dir = "/home/mammone/Downloads/BOR-Transcripts/Hamson";

  console.log("Seeding DB with transcripts from " + dir);
  
  const transcriptObjects : any[] = [];

  //Map of filename to transcript objects
  const transcriptMap = new Map();

  const directoryLoader = new DirectoryLoader(
    dir,
    {
      ".pdf": 
        (filePath: string) => {
          const loader = new PDFLoader(filePath);
          
          //store each file name in transcript array
          const newTransactionObject = { 
            id : "",
            name : path.basename(filePath),
            totalPages: "",
            transcript_chunks: [],
          };

          transcriptObjects.push(newTransactionObject);
          transcriptMap.set(path.basename(filePath), newTransactionObject);
          return loader;
        },
    }
  );
  
  const docs = await directoryLoader.load();  
  
  //insert all transcript objects into db
  for(const transcriptObject of transcriptObjects) {
    const dbTranscript = 
      await db
      .insert(transcripts)
      .values({ name : transcriptObject.name })
      .returning({ id : transcripts.id })
    
    transcriptObject.id = dbTranscript[0].id;
  }

  const splitDocs = await splitter.splitDocuments(docs);

  for (const docChunk of splitDocs) {

    //get transcript object
    const transcriptObject = transcriptMap.get(path.basename(docChunk.metadata.source));

    //This gets done for every chunk ... figure out how to only do once
    transcriptObject["totalPages"] = docChunk.metadata.pdf.totalPages;

    //set chunk metadata
    const newChunkObject = {
      pageNumber : docChunk.metadata.loc.pageNumber,
      fromLine : docChunk.metadata.loc.lines.from,
      toLine : docChunk.metadata.loc.lines.to,
      content : formatTextForDatabase(docChunk.pageContent), 
      transcriptId : transcriptObject.id,
    }

    //summarize chunk before for better embedding
    const summary = await summarizer.invoke({
      input_documents: [docChunk.pageContent],
    });

    //Generate and set embedding
    const embedding = await generateOpenAIEmbedding(docChunk.pageContent);
    // transcriptObject["transcript_chunks"].push({...newChunkObject, embedding });    
  
    //insert transcript chunk with embedding
    await db
          .insert(transcript_chunks)
          .values({...newChunkObject, embedding })
  }

  console.log('DB Seeded Successfully!')
}

main()
  .then(async () => {
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)

    process.exit(1)
  })

