import { OllamaEmbeddings} from "@langchain/community/embeddings/ollama";

/***
 * Takes input string, strips middle dot ("Georgian Comma")
 * Removes newlines and replaces with spaces.
 * Trims each line before joining them all together
 */
export function formatTextForEmbedding(_input: string) {
    return  _input.replaceAll('\u00B7', '')
            .split('\n')
            .map(element =>  element.trim())
            .join(' ');
}
  
/***
 * Takes input string, strips middle dot ("Georgian Comma")
 * Trims each line before joining them all together
 */
export function formatTextForDatabase(_input: string) {
    return  _input.replaceAll('\u00B7', '')
            .split('\n')
            .map(element =>  element.trim())
            .join('\n');
}

export async function generateEmbedding(_input: string) {
    const embedder = new OllamaEmbeddings({
        model: 'nomic-embed-text:latest',
        baseUrl: "http://localhost:11434",
      });
      
    const formattedInput = formatTextForEmbedding(_input);
    const embedding = await embedder.embedQuery(formattedInput);
    return embedding;
}