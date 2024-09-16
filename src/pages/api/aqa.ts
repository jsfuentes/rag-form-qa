import { NextApiRequest, NextApiResponse } from "next";
import { generateQuestionAnswer } from "src/utils/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { question, corpusId } = req.body;

    console.log(`Received AQA request for corpusId: ${corpusId}`);
    console.log(`Question: "${question}"`);

    const answer = await generateQuestionAnswer(question, corpusId);

    console.log(`Generated answer: ${answer}`);

    res.status(200).json({ answer });
  } catch (error) {
    console.error("Error in AQA endpoint:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the request" });
  }
}
