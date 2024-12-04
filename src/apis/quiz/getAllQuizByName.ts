import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAllQuizById = Router();

getAllQuizById.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, userId } = req.query;

    // Validate inputs
    if (!id || typeof id !== "string") {
      res.status(400).json({ message: "Invalid or missing 'id' query parameter." });
      return;
    }

    if (!userId || typeof userId !== "string") {
      res.status(400).json({ message: "Invalid or missing 'userId' query parameter." });
      return;
    }

    // Fetch user's answers
    const userAnswers = await prisma.userAnswer.findMany({
      where: {
        userId: userId,
      },
      select: {
        questionId: true,
        answer: true,
      },
    });

    console.log(userAnswers);

    // Fetch quizzes by ID
    const quizzes = await prisma.quiz.findMany({
      where: {
        id: {
          contains: id, // Case-sensitive matching
        },
      },
      include: {
        questions: true, // Include related questions
      },
    });

    // Transform quizzes to include the `chooseAns` field and calculate the score
    let totalScore = 0; // Initialize total score
    let totalAttemptedQuestions = 0; // Initialize total attempted questions counter

    const transformedQuizzes = quizzes.map((quiz) => ({
      ...quiz,
      questions: quiz.questions.map((question) => {
        const userAnswer = userAnswers.find((ua) => ua.questionId === question.id);
        const chooseAns = userAnswer ? userAnswer.answer : null; // Add `chooseAns` field

        // Check if the answer is correct and calculate the score
        if (chooseAns === question.correctOption) {
          totalScore += 1; // Increment score for correct answers
        }

        // Increment total attempted questions if the user has chosen an answer
        if (chooseAns !== null) {
          totalAttemptedQuestions += 1;
        }

        return {
          ...question,
          chooseAns, // Include the user's chosen answer
        };
      }),
    }));

    if (transformedQuizzes.length === 0) {
      res.status(404).json({ message: "No quizzes found with the given ID." });
      return;
    }

    res.status(200).json({
      message: "Quizzes retrieved successfully.",
      quizzes: transformedQuizzes,
      score: totalScore, // Return the total score
      totalAttemptedQuestions, // Return the total attempted questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while retrieving quizzes." });
  }
});

export default getAllQuizById;
