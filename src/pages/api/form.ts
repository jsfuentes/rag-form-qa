import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "src/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Create a new form
    try {
      const { name, questions } = req.body;
      const newForm = await prisma.form.create({
        data: {
          name,
          questions: {
            create: questions.map((q: { label: string; type: string }) => ({
              label: q.label,
              type: q.type,
            })),
          },
        },
      });
      res.status(201).json(newForm);
    } catch (error) {
      res.status(500).json({ error: "Error creating form" });
    }
  } else if (req.method === "PUT") {
    // Update an existing form
    try {
      const { id, name, questions } = req.body;
      console.log("req.body", req.body);
      const updatedForm = await prisma.form.update({
        where: { id: parseInt(id) },
        data: {
          name,
          questions: {
            deleteMany: {
              id: {
                notIn: questions
                  .map((q: { id?: number }) => q.id)
                  .filter((id): id is number => id !== undefined),
              },
            },
            upsert: questions.map(
              (q: { id?: number; label: string; type: string }) => ({
                where: { id: q.id || -1 },
                update: { label: q.label, type: q.type },
                create: { label: q.label, type: q.type },
              })
            ),
          },
        },
      });
      console.log("Form updated successfully:", updatedForm);
      res.status(200).json(updatedForm);
    } catch (error) {
      console.error("Error updating form:", error);
      res.status(500).json({ error: "Error updating form" });
    }
  } else if (req.method === "GET") {
    // Get a form
    try {
      const { id } = req.query;
      const form = await prisma.form.findUnique({
        where: { id: parseInt(id as string) },
        include: { questions: true },
      });
      if (form) {
        res.status(200).json(form);
      } else {
        res.status(404).json({ error: "Form not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error retrieving form" });
    }
  } else {
    res.setHeader("Allow", ["POST", "PUT", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
