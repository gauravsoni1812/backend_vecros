import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../..";

const signupDetails = Router();

signupDetails.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body);  // Log the request body for debugging

    const { password, userName, isAdmin } = req.body;

    // Check if userName already exists (ensure userName is unique in your schema)
    const existUser = await prisma.user.findUnique({
      where: { userName: userName }, // This will now work because userName is unique
    });

    if (existUser) {
      res.status(400).json({ error: "Please use a unique username" });
      return
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        const response = await prisma.user.create({
          data: {
            password: hashedPassword,
            userName,
            isAdmin:isAdmin
          },
        });
     
        console.log(response)
        res.status(200).json({ msg: `Welcome ${userName} to Tablesprint!` });
        return 
      } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error });
        return 
      }
    } else {
      res.status(400).json({ error: "Password is required" });
      return 
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
    return 
  }
});

export default signupDetails;
