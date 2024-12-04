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
const getAll = (0, express_1.Router)();
getAll.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        // Fetch all quizzes with only 'id' and 'name'
        const quizzes = yield prisma.quiz.findMany({
            select: {
                id: true, // Select 'id' field
                name: true, // Select 'name' field
            },
        });
        if (quizzes.length === 0) {
            res.status(404).json({ message: "No quizzes found." });
            return;
        }
        res.status(200).json({ message: "Quizzes retrieved successfully.", quizzes });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while retrieving quizzes." });
    }
}));
exports.default = getAll;
