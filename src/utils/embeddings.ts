import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const PINECONE_INDEX_NAME = "corpus-embeddings"; // Replace with your index name

if (!process.env.PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY is not set in .env");
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in .env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
  });

  return response.data[0].embedding;
}

export async function saveEmbeddingToPinecone(id: number, embedding: number[]) {
  const index = pinecone.Index(PINECONE_INDEX_NAME);
  await index.upsert([
    {
      id: id.toString(),
      values: embedding,
    },
  ]);
}

export function splitTextIntoPairs(
  text: string,
  sentencesPerPair: number = 2
): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const pairs = [];
  for (let i = 0; i < sentences.length; i += sentencesPerPair) {
    pairs.push(sentences.slice(i, i + sentencesPerPair).join(" "));
  }
  return pairs;
}

export async function saveEmbeddingsToPinecone(
  corpusId: number,
  textPairs: string[],
  embeddings: number[][]
) {
  const index = pinecone.Index(PINECONE_INDEX_NAME);
  const vectors = textPairs.map((text, i) => ({
    id: `${corpusId}-${i}`,
    values: embeddings[i],
    metadata: { text, corpusId },
  }));

  const batchSize = 100;
  const batches = [];
  for (let i = 0; i < vectors.length; i += batchSize) {
    batches.push(vectors.slice(i, i + batchSize));
  }
  await Promise.all(batches.map((batch) => index.upsert(batch)));
}

export async function queryNearestEmbeddings(
  embedding: number[],
  corpusId: number,
  k: number = 3
) {
  const index = pinecone.Index(PINECONE_INDEX_NAME);
  const queryResponse = await index.query({
    vector: embedding,
    topK: k,
    includeMetadata: true,
    filter: { corpusId: corpusId },
  });
  return queryResponse.matches;
}
