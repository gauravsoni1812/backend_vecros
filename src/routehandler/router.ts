import { Router } from "express";
import signinDetails from "../apis/auth/signIn";
import signupDetails from "../apis/auth/signup";
import createQuiz from "../apis/quiz/createQuiz";
import getAllQuizById from "../apis/quiz/getAllQuizByName";
import getAll from "../apis/quiz/getAllQuiz";
import userAns from "../apis/user/userAns";
import getQuizScores from "../apis/admin/getQuizScores";

const userRouter = Router();

// Set up routes correctly
userRouter.use("/signin", signinDetails); // Will match POST /signin
userRouter.use("/signup", signupDetails); // Will match POST /signup


userRouter.use("/createQuiz", createQuiz);
userRouter.use("/getQuiz", getAllQuizById);
userRouter.use("/getAll", getAll);
userRouter.use("/userAns", userAns)  
userRouter.use("/getscore", getQuizScores)  


// You can add more routes here as needed

export default userRouter;
