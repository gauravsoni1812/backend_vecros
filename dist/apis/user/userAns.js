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
const userAns = (0, express_1.Router)();
userAns.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, questionId, selectedAnswer } = req.body;
        // Validate input
        if (!userId || !questionId || !selectedAnswer) {
            res.status(400).json({ message: "Invalid input. 'userId', 'questionId', and 'selectedAnswer' are required." });
            return;
        }
        // Fetch the question to get the correct answer
        const question = yield prisma.question.findUnique({
            where: { id: questionId },
        });
        if (!question) {
            res.status(404).json({ message: "Question not found." });
            return;
        }
        // Check if the selected answer is correct
        const isCorrect = question.correctOption === selectedAnswer;
        // Create or update the user's answer in the database
        const userAnswer = yield prisma.userAnswer.upsert({
            where: { userId_questionId: { userId, questionId } }, // Ensure a user can only answer a question once
            update: { answer: selectedAnswer, isCorrect }, // Update the answer and correctness if it exists
            create: { userId, questionId, answer: selectedAnswer, isCorrect }, // Create a new answer record if it doesn't exist
        });
        res.status(200).json({
            message: "Answer recorded successfully.",
            userAnswer,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while recording the answer." });
    }
}));
exports.default = userAns;
