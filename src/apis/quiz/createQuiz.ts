import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const createQuiz = Router();

createQuiz.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, questions } = req.body;

    if (!name || !Array.isArray(questions)) {
      res.status(400).json({ message: "Invalid data provided." });
      return;
    }

    // Create the quiz and its questions in a single transaction
    const quiz = await prisma.quiz.create({
      data: {
        name,
        questions: {
          create: questions.map((question: any) => ({
            question: question.question,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            correctOption: question.correctOption || "optionA", // Default to optionA if not provided
          })),
        },
      },
      include: { questions: true },
    });

    res.status(201).json({ message: "Quiz created successfully.", quiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while creating the quiz." });
  }
});

export default createQuiz;
