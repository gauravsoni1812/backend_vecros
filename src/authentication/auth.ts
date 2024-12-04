import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
              
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: "Authorization header missing" });
            return;
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Token missing" });
            return;
        }
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY || '') as jwt.JwtPayload;

        req.Id  = decoded.Id;

        next();  
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default auth;