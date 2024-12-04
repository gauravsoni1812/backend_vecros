import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const userAns = Router();

userAns.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, questionId, selectedAnswer } = req.body;

    // Validate input
    if (!userId || !questionId || !selectedAnswer) {
      res.status(400).json({ message: "Invalid input. 'userId', 'questionId', and 'selectedAnswer' are required." });
      return;
    }

    // Fetch the question to get the correct answer
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      res.status(404).json({ message: "Question not found." });
      return;
    }

    // Check if the selected answer is correct
    const isCorrect = question.correctOption === selectedAnswer;

    // Create or update the user's answer in the database
    const userAnswer = await prisma.userAnswer.upsert({
      where: { userId_questionId: { userId, questionId } }, // Ensure a user can only answer a question once
      update: { answer: selectedAnswer, isCorrect }, // Update the answer and correctness if it exists
      create: { userId, questionId, answer: selectedAnswer, isCorrect }, // Create a new answer record if it doesn't exist
    });

    res.status(200).json({
      message: "Answer recorded successfully.",
      userAnswer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while recording the answer." });
  }
});

export default userAns;
