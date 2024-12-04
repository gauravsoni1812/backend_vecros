import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getQuizScores = Router();

getQuizScores.get("/:quizId", async (req: Request, res: Response): Promise<void> => {
  const { quizId } = req.params;

  try {
    // Fetch the quiz by quizId to get the quiz name and questions
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        questions: true, // Include related questions to get the correct answers
      },
    });

    if (!quiz) {
      res.status(404).json({ message: "Quiz not found." });
      return;
    }

    // Fetch all user answers for the given quiz
    const userAnswers = await prisma.userAnswer.findMany({
      where: {
        questionId: {
          in: quiz.questions.map((question) => question.id), // Match answers for the questions in the quiz
        },
      },
      include: {
        user: true, // Include user details to get the username
        question: true, // Include question details for comparison
      },
    });

    // Calculate score for each user
    const userScores: Record<string, { userId: string; userName: string; score: number }> = {};

    userAnswers.forEach((answer) => {
      const { userId, question, answer: selectedAnswer, user } = answer;
      const correctAnswer = question.correctOption;

      // Initialize user score if not already set
      if (!userScores[userId]) {
        userScores[userId] = { userId, userName: user.userName, score: 0 }; // Fetch username from user data
      }

      // Compare selected answer with correct answer
      if (selectedAnswer === correctAnswer) {
        userScores[userId].score += 1; // Increment score for correct answer
      }
    });

    // Convert object to an array of user scores
    const scores = Object.values(userScores);

    res.status(200).json({
      message: "User scores retrieved successfully.",
      quizName: quiz.name, // Add quiz name to the response
      scores,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while retrieving user scores." });
  }
});

export default getQuizScores;
