import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "src/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Received request:", req.method, req.url);
  console.log("Request body:", req.body);
  console.log("Request query:", req.query);

  if (req.method === "POST") {
    // Create a new case
    try {
      const { formId, answers } = req.body;
      console.log("Creating new case for formId:", formId);
      console.log("Answers:", answers);

      const newCase = await prisma.case.create({
        data: {
          form: { connect: { id: formId } },
          answers: {
            create: answers.map(
              (a: { value: string; formQuestionId: number }) => ({
                value: a.value,
                formQuestion: { connect: { id: a.formQuestionId } },
              })
            ),
          },
        },
      });
      console.log("New case created:", newCase);
      res.status(201).json(newCase);
    } catch (error) {
      console.error("Error creating case:", error);
      res.status(500).json({ error: "Error creating case" });
    }
  } else if (req.method === "PUT") {
    // Update an existing case
    try {
      const { id, formId, answers } = req.body;
      console.log("Updating case:", id);
      console.log("New formId:", formId);
      console.log("New answers:", answers);

      const updatedCase = await prisma.case.update({
        where: { id: parseInt(id) },
        data: {
          form: { connect: { id: formId } },
          answers: {
            deleteMany: {
              id: {
                notIn: answers
                  .map((a: { id?: number }) => a.id)
                  .filter((id): id is number => id !== undefined),
              },
            },
            upsert: answers.map(
              (a: { id?: number; value: string; formQuestionId: number }) => ({
                where: { id: a.id || -1 },
                update: { value: a.value },
                create: {
                  value: a.value,
                  formQuestion: { connect: { id: a.formQuestionId } },
                },
              })
            ),
          },
        },
      });
      console.log("Case updated successfully:", updatedCase);
      res.status(200).json(updatedCase);
    } catch (error) {
      console.error("Error updating case:", error);
      res.status(500).json({ error: "Error updating case" });
    }
  } else if (req.method === "GET") {
    // Get a case
    try {
      const { id } = req.query;
      console.log("Fetching case with id:", id);

      const caseData = await prisma.case.findUnique({
        where: { id: parseInt(id as string) },
        include: { answers: true },
      });
      if (caseData) {
        console.log("Case found:", caseData);
        res.status(200).json(caseData);
      } else {
        console.log("Case not found for id:", id);
        res.status(404).json({ error: "Case not found" });
      }
    } catch (error) {
      console.error("Error retrieving case:", error);
      res.status(500).json({ error: "Error retrieving case" });
    }
  } else {
    console.log("Method not allowed:", req.method);
    res.setHeader("Allow", ["POST", "PUT", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
