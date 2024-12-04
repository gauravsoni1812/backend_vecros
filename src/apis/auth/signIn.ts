import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../..";
import { User } from "../../types/user";

const signinDetails = Router();

signinDetails.post("/", async (req: Request, res: Response): Promise<void> => {
  const { userName, password }: { userName: string; password: string } =
    req.body;
  try {
    const user = (await prisma.user.findUnique({
      where: { userName },
    })) as User | null; // Handle the case where the user may be null

    if (!user) {
      res.status(404).send({ error: "Email not found" });
      return;
    }
    console.log(user)
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      res.status(401).send({ error: "Password does not match" });
      return;
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        userName:user.userName,
        isAdmin:user.isAdmin
      },
      process.env.SECRET_KEY as string,
      { expiresIn: "24h" }
    );

    res.status(200).send({
      msg: "Login Successful",
      userName: user.userName,
      token,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
    return;
  }
});

export default signinDetails;
