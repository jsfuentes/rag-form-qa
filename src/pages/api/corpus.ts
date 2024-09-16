import { NextApiRequest, NextApiResponse } from "next";
import {
  generateEmbedding,
  saveEmbeddingsToPinecone,
  splitTextIntoPairs,
} from "src/utils/embeddings";
import prisma from "src/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { caseId } = req.query;
    try {
      console.log(`Fetching corpus for caseId: ${caseId}`);
      const corpus = await prisma.corpus.findMany({
        where: { caseId: Number(caseId) },
        orderBy: { createdAt: "desc" },
      });
      console.log(`Found ${corpus.length} corpus entries`);
      res.status(200).json(corpus);
    } catch (error) {
      console.error("Error fetching corpus:", error);
      res.status(500).json({ error: "Error fetching corpus" });
    }
  } else if (req.method === "POST") {
    try {
      const { title, content, caseId } = req.body;
      console.log(
        `Received request to create corpus: title=${title}, caseId=${caseId}`
      );
      console.log("content", content);

      // Split content into pairs and generate embeddings
      const textPairs = splitTextIntoPairs(content, 3);
      console.log("textPairs", textPairs);
      console.log(`Split content into ${textPairs.length} text pairs`);
      const embeddings = await Promise.all(textPairs.map(generateEmbedding));
      console.log(`Generated ${embeddings.length} embeddings`);

      // Save corpus to database
      const corpus = await prisma.corpus.create({
        data: {
          title,
          content,
          case: { connect: { id: caseId } },
        },
      });
      console.log(`Saved corpus to database with id: ${corpus.id}`);

      // Save embeddings to Pinecone
      await saveEmbeddingsToPinecone(corpus.id, textPairs, embeddings);
      console.log(`Saved embeddings to Pinecone for corpus id: ${corpus.id}`);

      res.status(201).json(corpus);
    } catch (error) {
      console.error("Error creating corpus:", error);
      res.status(500).json({ error: "Error creating corpus" });
    }
  } else {
    console.log(`Method ${req.method} not allowed`);
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
