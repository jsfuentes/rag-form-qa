import OpenAI from "openai";
import { generateEmbedding, queryNearestEmbeddings } from "./embeddings";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in .env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateQuestionAnswer(
  question: { label: string; id: number; type: string },
  corpusId: number,
  model: string = "gpt-4o-mini"
): Promise<string> {
  try {
    console.log(`Generating chat completion for question: "${question.label}"`);
    console.log(`Using model: ${model}`);

    // Generate embedding for the question
    console.log("Generating embedding for question");
    const questionEmbedding = await generateEmbedding(question.label);
    console.log("Embedding generated successfully");

    // Query the vector database for the three closest neighbors
    console.log(`Querying vector database for corpus ID: ${corpusId}`);
    const neighbors = await queryNearestEmbeddings(
      questionEmbedding,
      corpusId,
      3
    );
    console.log("Neighbors:", neighbors);
    console.log(`Found ${neighbors.length} nearest neighbors`);

    // Prepare the context for OpenAI
    const context = neighbors.map((n) => n.metadata?.text).join("\n\n");
    console.log("Context prepared from neighbors");

    // Create a prompt with the context and the original question
    let enhancedPrompt = `
Context:
${context}

Question: ${question.label}

Please answer the question based solely on the given context.
`;

    // Add specific instructions based on question type
    let formatInstruction = "";
    switch (question.type) {
      case "text":
        formatInstruction = "Provide a concise text answer.";
        break;
      case "checkbox":
        formatInstruction =
          "Answer with either 'Yes' or 'No'. If uncertain, respond with 'Unknown'.";
        break;
      case "date":
        formatInstruction =
          "Provide the answer in YYYY-MM-DD format. If not applicable, respond with 'Unknown'.";
        break;
      default:
        formatInstruction =
          "Provide a concise answer in the most appropriate format.";
    }

    // Append the format instruction to the enhanced prompt
    enhancedPrompt += `\n\nAnswer format: ${formatInstruction}`;

    console.log("Enhanced prompt created", enhancedPrompt);

    const messages = [
      {
        role: "system",
        content:
          "You are an automated question answering system. Only use the provided context to answer questions. If the answer is very clearly not in the context and is a matter of fact and not opinion, say 'Unknown' otherwise give the answer in the specific format.",
      },
      { role: "user", content: enhancedPrompt },
    ];

    console.log("Sending request to OpenAI API");
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });
    console.log("Received response from OpenAI API");

    const response = completion.choices[0].message.content || "";
    console.log(`Generated response: "${response.substring(0, 50)}..."`);

    return response;
  } catch (error) {
    console.error("Error in generateChatCompletion:", error);
    throw error;
  }
}
