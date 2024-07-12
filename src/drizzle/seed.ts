import 'dotenv/config'
import { db } from './db'
import { transcripts, transcript_chunks } from './schema'
import fs from 'fs';
import path from 'path';

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings} from "@langchain/community/embeddings/ollama";

// import { openai } from '../lib/openai'
// import { embed } from 'ai'

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error('process.env.OPENAI_API_KEY is not defined. Please set it.')
// }

if (!process.env.DATABASE_URL) {
  throw new Error('process.env.DATABASE_URL is not defined. Please set it.')
}

const embedder = new OllamaEmbeddings({
  model: 'nomic-embed-text:latest',
  baseUrl: "http://localhost:11434",
});

async function main() {
  try {
    const transcript = await db.query.transcripts.findFirst({
        // where: (transcripts, { eq }) => eq(transcri.name, 'Pikachu'),
    })

    if (transcript) {
      console.log('Transcripts already seeded!')
      return
    }
  } catch (error) {
    console.error('Error checking if Transcripts exist in the database.')
    throw error
  }

  const dir = "/home/mammone/Downloads/BOR-Transcripts/Hamson/test";

  console.log("Seeding DB with transcripts from " + dir);
  
  const transcriptObjects : any[] = [];

  const directoryLoader = new DirectoryLoader(
    dir,
    {
      ".pdf": 
        (filePath: string) => {
          transcriptObjects.push({
            name: path.basename(filePath),    
          });
          return new PDFLoader(filePath)
        },
    }
  );
  
  const docs = await directoryLoader.load();  
  
  console.log(transcriptObjects)
  //split pdf
  const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 10,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  for (const docChunk of splitDocs) {

    // const embedding = await generateEmbedding(docChunk.pageContent);
    // console.log(embedding);
    
    break;

    // await new Promise((r) => setTimeout(r, 500)); // Wait 500ms between requests;
    // const { embedding, ...p } = record

    // Create the pokemon in the database
    // const [pokemon] = await db.insert(pokemons).values(p).returning()

    // await db
    //   .update(pokemons)
    //   .set({
    //     embedding,
    //   })
    //   .where(eq(pokemons.id, pokemon.id))

    // console.log(`Added ${pokemon.number} ${pokemon.name}`)

    // Uncomment the following lines if you want to generate the JSON file
    // fs.writeFileSync(
    //   path.join(__dirname, "./pokemon-with-embeddings.json"),
    //   JSON.stringify({ data }, null, 2),
    // );
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

async function generateEmbedding(_input: string) {
  const formattedInput = formatTextForEmbedding(_input);
  const embedding = await embedder.embedQuery(formattedInput);
  return embedding;
}

/***
 * Takes input string, strips middle dot ("Georgian Comma")
 * Removes newlines and replaces with spaces.
 * Trims each line before joining them all together
 */
function formatTextForEmbedding(_input: string) {
  return  _input.replaceAll('\u00B7', '')
          .split('\n')
          .map(element =>  element.trim())
          .join(' ');
}