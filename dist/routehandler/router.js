"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signIn_1 = __importDefault(require("../apis/auth/signIn"));
const signup_1 = __importDefault(require("../apis/auth/signup"));
const createQuiz_1 = __importDefault(require("../apis/quiz/createQuiz"));
const getAllQuizByName_1 = __importDefault(require("../apis/quiz/getAllQuizByName"));
const getAllQuiz_1 = __importDefault(require("../apis/quiz/getAllQuiz"));
const userAns_1 = __importDefault(require("../apis/user/userAns"));
const getQuizScores_1 = __importDefault(require("../apis/admin/getQuizScores"));
const userRouter = (0, express_1.Router)();
// Set up routes correctly
userRouter.use("/signin", signIn_1.default); // Will match POST /signin
userRouter.use("/signup", signup_1.default); // Will match POST /signup
userRouter.use("/createQuiz", createQuiz_1.default);
userRouter.use("/getQuiz", getAllQuizByName_1.default);
userRouter.use("/getAll", getAllQuiz_1.default);
userRouter.use("/userAns", userAns_1.default);
userRouter.use("/getscore", getQuizScores_1.default);
// You can add more routes here as needed
exports.default = userRouter;
