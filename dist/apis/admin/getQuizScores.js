"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getQuizScores = (0, express_1.Router)();
getQuizScores.get("/:quizId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId } = req.params;
    try {
        // Fetch the quiz by quizId to get the quiz name and questions
        const quiz = yield prisma.quiz.findUnique({
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
        const userAnswers = yield prisma.userAnswer.findMany({
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
        const userScores = {};
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while retrieving user scores." });
    }
}));
exports.default = getQuizScores;
