import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAll = Router();

getAll.get("/", async (req: Request, res: Response): Promise<void> => {

  try {
    const userId = req.params.userId
    // Fetch all quizzes with only 'id' and 'name'
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,   // Select 'id' field
        name: true, // Select 'name' field
      },
    });

    if (quizzes.length === 0) {
      res.status(404).json({ message: "No quizzes found." });
      return;
    }

    res.status(200).json({ message: "Quizzes retrieved successfully.", quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while retrieving quizzes." });
  }
});

export default getAll;
