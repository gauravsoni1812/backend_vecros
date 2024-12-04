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
const createQuiz = (0, express_1.Router)();
createQuiz.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, questions } = req.body;
        if (!name || !Array.isArray(questions)) {
            res.status(400).json({ message: "Invalid data provided." });
            return;
        }
        // Create the quiz and its questions in a single transaction
        const quiz = yield prisma.quiz.create({
            data: {
                name,
                questions: {
                    create: questions.map((question) => ({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the quiz." });
    }
}));
exports.default = createQuiz;
